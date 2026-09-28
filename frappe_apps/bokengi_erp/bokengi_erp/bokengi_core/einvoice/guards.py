# -*- coding: utf-8 -*-
# Copyright (c) 2026, Bokengi Group and contributors
# For license information, please see license.txt

import frappe
from frappe import _

def validate_sales_invoice_manual_submission(doc, method=None):
    """
    Garde-fou constitutionnel Bokengi 2.0 :
    Interdit formellement toute soumission automatisée par un script, un webhook, ou une tâche planifiée.
    Exige la présence d'une session humaine avec le rôle 'Accounts Manager' ou 'System Manager'.
    """
    # Autoriser l'exécution dans le cadre strict des tests automatisés mockés
    if getattr(frappe.flags, "in_test", False):
        return

    # Vérification de l'utilisateur de session
    current_user = frappe.session.user if hasattr(frappe, "session") else None
    if not current_user or current_user in ["Guest", "Administrator"]:
        # Si exécuté en background/guest
        if frappe.flags.in_migrate or frappe.flags.in_install:
            return
        frappe.throw(_("Interdiction : La soumission d'une facture requiert un utilisateur humain authentifié."))

    roles = frappe.get_roles(current_user)
    if "Accounts Manager" not in roles and "System Manager" not in roles:
        frappe.throw(_("Interdiction : Seul un utilisateur ayant le rôle 'Accounts Manager' peut soumettre une facture de vente."))
