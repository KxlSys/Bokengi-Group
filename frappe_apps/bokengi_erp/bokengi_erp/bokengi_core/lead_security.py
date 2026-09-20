"""
Module de sécurité et d'immutabilité des prospects Bokengi Group.
Garantit côté serveur qu'aucune modification des 9 champs originaux soumis par le prospect
ne peut être enregistrée dans la base de données ERPNext.
"""

import frappe
from frappe import _

# Liste stricte des 9 champs prospect immuables
IMMUTABLE_PROSPECT_FIELDS = [
    "first_name",
    "last_name",
    "company_name",
    "email_id",
    "mobile_no",
    "custom_request_type",
    "custom_requested_pole",
    "custom_original_message",
    "source",
]

def validate_lead_immutability(doc, method=None):
    """
    Hook déclenché sur l'événement before_save du DocType Lead.
    Rejette toute tentative de modification d'un champ prospect original.
    Les champs de traitement interne (status, custom_priority, custom_treatment_pole,
    lead_owner, notes) restent librement modifiables par les équipes habilitées.
    """
    if doc.is_new():
        # Nouvelle soumission : autorisée
        return

    old_doc = doc.get_doc_before_save()
    if not old_doc:
        return

    for field in IMMUTABLE_PROSPECT_FIELDS:
        old_val = old_doc.get(field)
        new_val = doc.get(field)

        # Normalisation des chaînes vides et None
        old_norm = "" if old_val is None else str(old_val).strip()
        new_norm = "" if new_val is None else str(new_val).strip()

        if old_norm != new_norm:
            frappe.throw(
                _(
                    f'Action non autorisée : le champ "{field}" fait partie de la '
                    f'soumission originale du prospect et est strictement immuable.'
                ),
                exc=frappe.PermissionError,
                title=_("Intégrité Prospect Sanctuarisée"),
            )
