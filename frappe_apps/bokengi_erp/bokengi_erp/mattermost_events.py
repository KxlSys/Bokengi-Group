"""
Module Frappe / ERPNext d'émission des notifications vers Mattermost.
Respecte rigoureusement la minimisation des données (RGPD).
Interdiction absolue d'inclure : IBAN, BIC, mots de passe, tokens, secrets.
"""

import os
import json
import urllib.request
import urllib.error
import frappe

def normalize_pole_id(raw_pole):
    """Normalise un slug ou code pôle vers POL-* canonique."""
    if not raw_pole or not isinstance(raw_pole, str):
        return None
    clean = raw_pole.strip().lower()
    if not clean:
        return None
    if clean in ("it", "bokengi-it", "pol-it"): return "POL-it"
    if clean in ("digital", "bokengi-digital", "pol-digital"): return "POL-digital"
    if clean in ("business", "bokengi-business", "pol-business"): return "POL-business"
    if clean in ("consulting", "bokengi-consulting", "pol-consulting"): return "POL-consulting"
    if clean in ("events", "bokengi-events", "pol-events"): return "POL-events"
    return None

def get_pole_webhook_url(pole_id):
    """
    Récupère le webhook spécifique d'un pôle.
    RÈGLE STRICTE : Si pôle inconnu ou webhook absent -> renvoie None (AUCUN FALLBACK TRANSVERSE).
    """
    norm = normalize_pole_id(pole_id)
    if not norm:
        return None
    env_map = {
        "POL-it": "MATTERMOST_WEBHOOK_POLE_IT",
        "POL-digital": "MATTERMOST_WEBHOOK_POLE_DIGITAL",
        "POL-business": "MATTERMOST_WEBHOOK_POLE_BUSINESS",
        "POL-consulting": "MATTERMOST_WEBHOOK_POLE_CONSULTING",
        "POL-events": "MATTERMOST_WEBHOOK_POLE_EVENTS",
    }
    env_var = env_map.get(norm)
    if not env_var:
        return None
    return os.environ.get(env_var) or getattr(frappe.conf, env_var.lower(), None)

def _get_webhook_url(event_type):
    """Récupère l'URL du webhook Mattermost configuré pour les événements transverses de vente/finance."""
    env_map = {
        "SALES": "MATTERMOST_WEBHOOK_SALES",
        "FINANCE": "MATTERMOST_WEBHOOK_FINANCE",
        "OPS": "MATTERMOST_WEBHOOK_OPS",
    }
    env_var = env_map.get(event_type, "MATTERMOST_WEBHOOK_URL")
    return os.environ.get(env_var) or getattr(frappe.conf, env_var.lower(), None)

def _send_mattermost(text, channel_type="LEADS"):
    """Envoie un message Markdown vers le webhook Mattermost approprié de façon asynchrone / non-bloquante."""
    webhook_url = _get_webhook_url(channel_type)
    if not webhook_url:
        return

    payload = {
        "username": "Bokengi ERP Desk",
        "icon_emoji": ":briefcase:",
        "text": text
    }

    try:
        req = urllib.request.Request(
            webhook_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        frappe.logger().warning(f"[Mattermost Events] Échec notification : {str(e)}")

def on_lead_inserted(doc, method=None):
    """Événement 1 : Nouveau Lead inséré dans ERPNext Desk avec routage par pôle isolé."""
    pole = doc.get("custom_requested_pole") or doc.get("custom_treatment_pole")
    norm_pole = normalize_pole_id(pole)
    
    if not norm_pole:
        frappe.logger("bokengi_erp").warning(
            f"[Mattermost Events] Lead {doc.name} inséré sans pôle valide ({pole}). Notification ignorée."
        )
        return

    webhook_url = get_pole_webhook_url(norm_pole)
    if not webhook_url:
        frappe.logger("bokengi_erp").info(
            f"[Mattermost Events] Aucun webhook configuré pour le pôle {norm_pole}. Notification ignorée."
        )
        return

    base_url = frappe.utils.get_url()
    desk_url = f"{base_url}/app/lead/{doc.name}"
    pole_name_map = {
        "POL-it": "BOKENGI IT",
        "POL-digital": "BOKENGI DIGITAL",
        "POL-business": "BOKENGI BUSINESS",
        "POL-consulting": "BOKENGI CONSULTING",
        "POL-events": "BOKENGI EVENTS",
    }
    pole_display = pole_name_map.get(norm_pole, norm_pole)

    msg_raw = doc.get("custom_original_message") or doc.get("custom_payload_message_raw") or doc.lead_name

    text = (
        f"### 🆕 NOUVELLE DEMANDE\n\n"
        f"**Pôle :** {pole_display}\n"
        f"**Client :** {doc.lead_name}"
        f"{f' ({doc.company_name})' if doc.company_name else ''}\n"
        f"**Projet / Description :** {msg_raw}\n"
        f"**Type :** {doc.get('custom_request_type') or 'Devis'}\n"
        f"**Statut :** {doc.status or 'Nouveau'}\n"
        f"**Email :** {doc.email_id}\n\n"
        f"🔗 [Voir dans ERPNext →]({desk_url})"
    )

    payload = {
        "username": f"Bokengi {pole_display}",
        "icon_emoji": ":incoming_envelope:",
        "text": text
    }

    try:
        req = urllib.request.Request(
            webhook_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        frappe.logger("bokengi_erp").warning(f"[Mattermost Events] Échec notification pôle {norm_pole} : {str(e)}")

def on_quotation_draft_created(doc, method=None):
    """Événement 4 : Quotation créée en Draft dans ERPNext Desk."""
    base_url = frappe.utils.get_url()
    desk_url = f"{base_url}/app/quotation/{doc.name}"
    
    text = (
        f"### :memo: [AFFAIRES & DEVIS] Devis créé (Brouillon)\n"
        f"**Réf. Devis :** `{doc.name}`\n"
        f"| Paramètre | Valeur |\n"
        f"| :--- | :--- |\n"
        f"| **Client** | {doc.party_name or doc.customer_name or 'N/A'} |\n"
        f"| **Montant estimé** | **{doc.grand_total or 0.0} {doc.currency or 'EUR'}** |\n"
        f"| **Statut** | `Draft (En rédaction)` |\n\n"
        f"🔗 [Consulter le brouillon dans ERPNext Desk →]({desk_url})"
    )
    _send_mattermost(text, "SALES")

def on_quotation_submitted(doc, method=None):
    """Événement 5 : Quotation soumise et validée pour transmission."""
    base_url = frappe.utils.get_url()
    desk_url = f"{base_url}/app/quotation/{doc.name}"
    
    text = (
        f"### :page_facing_up: [AFFAIRES & DEVIS] Devis validé & soumis\n"
        f"**Réf. Officielle :** `{doc.name}`\n"
        f"| Paramètre | Valeur |\n"
        f"| :--- | :--- |\n"
        f"| **Client** | {doc.party_name or doc.customer_name or 'N/A'} |\n"
        f"| **Montant Total** | **{doc.grand_total} {doc.currency or 'EUR'}** |\n"
        f"| **Validité** | {doc.valid_till or '30 jours'} |\n"
        f"| **Auteur validation** | @{doc.modified_by or 'Admin'} |\n\n"
        f"🔗 [Accéder au devis validé dans ERPNext Desk →]({desk_url})"
    )
    _send_mattermost(text, "SALES")

def on_sales_order_submitted(doc, method=None):
    """Événement 6 : Sales Order validé et soumis."""
    base_url = frappe.utils.get_url()
    desk_url = f"{base_url}/app/sales-order/{doc.name}"
    
    text = (
        f"### :star2: [COMMANDES CLIENT] Bon de commande validé\n"
        f"**Commande :** `{doc.name}`\n"
        f"| Paramètre | Valeur |\n"
        f"| :--- | :--- |\n"
        f"| **Client** | {doc.customer_name or doc.customer or 'N/A'} |\n"
        f"| **Montant Engagement** | **{doc.grand_total} {doc.currency or 'EUR'}** |\n"
        f"| **Date livraison** | {doc.delivery_date or 'À planifier'} |\n\n"
        f"🔗 [Consulter la commande dans ERPNext Desk →]({desk_url})"
    )
    _send_mattermost(text, "SALES")

def on_sales_invoice_submitted(doc, method=None):
    """
    Événement 7 : Facture de vente émise APRÈS VALIDATION HUMAINE.
    RÈGLE ABSOLUE : ZÉRO COORDONNÉE BANCAIRE COMPLÈTE OU IBAN TRANSMIS DANS LE WEBHOOK.
    """
    base_url = frappe.utils.get_url()
    desk_url = f"{base_url}/app/sales-invoice/{doc.name}"
    
    text = (
        f"### :receipt: [FINANCE & FACTURATION] Facture de vente soumise (Validation Humaine)\n"
        f"**Facture Réf. :** `{doc.name}`\n"
        f"| Paramètre | Valeur |\n"
        f"| :--- | :--- |\n"
        f"| **Client** | {doc.customer_name or doc.customer or 'N/A'} |\n"
        f"| **Montant Exigible** | **{doc.grand_total} {doc.currency or 'EUR'}** |\n"
        f"| **Date d'échéance** | {doc.due_date or 'À réception'} |\n"
        f"| **Statut comptable** | `Submitted (Immuable)` |\n\n"
        f"🔗 [Consulter la pièce comptable dans ERPNext Desk →]({desk_url})"
    )
    _send_mattermost(text, "FINANCE")
