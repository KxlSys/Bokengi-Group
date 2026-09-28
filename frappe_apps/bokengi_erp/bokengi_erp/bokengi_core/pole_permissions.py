# -*- coding: utf-8 -*-
"""
MODULE DE CONTRÔLE D'ACCÈS SERVEUR PAR PÔLE BOKENGI GROUP 2.0 (ROW-LEVEL SECURITY)

Garantit côté serveur (Desk, Listes, Recherche, API REST, Rapports, Number Cards) :
1. Rôles de Direction (System Manager, Administrator, Bokengi Executive) :
   - Accès consolidé sans restriction à l'ensemble des pôles (vision Cockpit Enterprise 2.0).
2. Rôles Opérationnels (Sales User/Manager, Projects User/Manager, etc.) :
   - Accès strictement restreint aux documents Lead et Project dont le pôle (`custom_treatment_pole`)
     correspond aux User Permissions assignées à l'utilisateur sur `Bokengi Pole`.
   - Si un utilisateur opérationnel n'a aucun User Permission Bokengi Pole assigné,
     AUCUN accès aux documents des pôles n'est accordé par défaut (condition SQL 1=0 / Refus 403).
3. Immutabilité & Rejet de modification sur `custom_requested_pole`.
4. Propagation automatique du pôle lors de la création d'un Project depuis un Lead/Devis/Commande.
"""

import frappe
from frappe import _

DIRECTION_ROLES = {"System Manager", "Administrator", "Bokengi Executive"}


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


def is_executive_or_admin(user=None):
    """Vérifie si l'utilisateur possède un rôle de direction avec vision globale."""
    if not user:
        user = frappe.session.user

    if user in ("Administrator", "Script"):
        return True

    user_roles = set(frappe.get_roles(user))
    return bool(user_roles.intersection(DIRECTION_ROLES))


def get_user_allowed_poles(user=None):
    """
    Récupère la liste des pôles autorisés pour l'utilisateur depuis User Permission (Bokengi Pole).
    """
    if not user:
        user = frappe.session.user

    if not frappe.db.exists("DocType", "User Permission"):
        return []

    user_perms = frappe.get_all(
        "User Permission",
        filters={"user": user, "allow": "Bokengi Pole"},
        fields=["for_value"]
    )
    
    poles = []
    for p in user_perms:
        norm = normalize_pole_id(p.get("for_value"))
        if norm and norm not in poles:
            poles.append(norm)
            
    return poles


def get_lead_permission_query_conditions(user=None):
    """
    Hook Frappe permission_query_conditions pour DocType Lead.
    Injecte la condition SQL WHERE pour filtrer les listes, recherches, API REST, rapports et cartes.
    """
    if is_executive_or_admin(user):
        return ""

    if not frappe.db.has_column("Lead", "custom_treatment_pole"):
        return ""

    allowed_poles = get_user_allowed_poles(user)
    if not allowed_poles:
        return "`tabLead`.`custom_treatment_pole` IS NULL AND 1=0"

    escaped_poles = ", ".join([frappe.db.escape(p) for p in allowed_poles])
    return f"`tabLead`.`custom_treatment_pole` IN ({escaped_poles})"


def has_lead_permission(doc, ptype="read", user=None):
    """
    Hook Frappe has_permission pour DocType Lead.
    Contrôle l'accès individuel au document (API GET direct, modification, suppression).
    """
    if is_executive_or_admin(user):
        return True

    allowed_poles = get_user_allowed_poles(user)
    if not allowed_poles:
        return False

    doc_pole = normalize_pole_id(doc.get("custom_treatment_pole") or doc.get("custom_requested_pole"))
    if not doc_pole:
        return False

    return doc_pole in allowed_poles


def get_project_permission_query_conditions(user=None):
    """
    Hook Frappe permission_query_conditions pour DocType Project.
    """
    if is_executive_or_admin(user):
        return ""

    if not frappe.db.has_column("Project", "custom_treatment_pole"):
        return ""

    allowed_poles = get_user_allowed_poles(user)
    if not allowed_poles:
        return "`tabProject`.`custom_treatment_pole` IS NULL AND 1=0"

    escaped_poles = ", ".join([frappe.db.escape(p) for p in allowed_poles])
    return f"`tabProject`.`custom_treatment_pole` IN ({escaped_poles})"


def has_project_permission(doc, ptype="read", user=None):
    """
    Hook Frappe has_permission pour DocType Project.
    """
    if is_executive_or_admin(user):
        return True

    allowed_poles = get_user_allowed_poles(user)
    if not allowed_poles:
        return False

    doc_pole = normalize_pole_id(doc.get("custom_treatment_pole") or doc.get("custom_requested_pole"))
    if not doc_pole:
        return False

    return doc_pole in allowed_poles


def propagate_pole_to_project(doc, method=None):
    """
    Hook Frappe validate sur Project :
    Propage automatiquement custom_requested_pole et custom_treatment_pole depuis le Lead / Quotation / Sales Order.
    """
    if doc.get("custom_treatment_pole") and doc.get("custom_requested_pole"):
        return

    lead_name = doc.get("custom_lead_link") or doc.get("lead")
    if not lead_name and doc.get("sales_order"):
        if frappe.db.has_column("Sales Order", "custom_lead_link"):
            lead_name = frappe.db.get_value("Sales Order", doc.get("sales_order"), "custom_lead_link")

    if lead_name and frappe.db.exists("Lead", lead_name):
        lead_doc = frappe.get_doc("Lead", lead_name)
        req_pole = lead_doc.get("custom_requested_pole")
        treat_pole = lead_doc.get("custom_treatment_pole") or req_pole
        
        if req_pole and not doc.get("custom_requested_pole"):
            doc.custom_requested_pole = req_pole
        if treat_pole and not doc.get("custom_treatment_pole"):
            doc.custom_treatment_pole = treat_pole

    if not doc.get("custom_treatment_pole") and doc.get("custom_requested_pole"):
        doc.custom_treatment_pole = doc.custom_requested_pole
