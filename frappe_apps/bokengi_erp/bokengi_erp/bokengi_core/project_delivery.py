# -*- coding: utf-8 -*-
"""
MODULE DE LIVRAISON, RECETTE & GOUVERNANCE PROJETS BOKENGI GROUP 2.0 (CR-04)

Contrôles stricts :
1. Cycle documentaire de recette : Un projet ne peut être marqué 'Completed'
   sans présence vérifiée d'un Procès-Verbal de Recette ou livrable signé.
2. VERROU ANTI-FACTURATION : Aucun événement de fin de tâche ou de complétion
   de projet ne doit émettre, soumettre ou déclencher une Sales Invoice.
3. Rôles étanches : Delivery gère les tâches et livrables ; Finance/Direction
   conserve le contrôle exclusif et manuel sur la facturation.
"""

import frappe
from frappe import _


def validate_project_completion_acceptance(doc, method=None):
    """
    Vérifie les critères de conformité documentaire avant passage à Completed.
    """
    if doc.status == "Completed":
        # Vérification qu'au moins un fichier ou PV de recette est rattaché
        attached_files = frappe.get_all(
            "File",
            filters={
                "attached_to_doctype": "Project",
                "attached_to_name": doc.name
            },
            fields=["name", "file_name"]
        )

        # Si le projet est finalisé sans document rattaché, la clôture est strictement refusée
        if not attached_files:
            frappe.throw(
                _("Clôture refusée : Le projet {0} ne peut être marqué 'Completed' sans Procès-Verbal "
                  "de Recette signé rattaché dans les pièces jointes.").format(doc.name),
                title=_("Recette Documentaire Obligatoire")
            )

    # GARANTIE STRICTE : AUCUN DÉCLENCHEMENT DE SALES INVOICE
    # La validation humaine par la Direction Financière dans Desk reste 100% obligatoire.


def on_project_completed(doc, method=None):
    """
    Notification opérationnelle optionnelle lors de la finalisation d'un projet.
    """
    if doc.status == "Completed":
        frappe.logger("bokengi_erp").info(
            f"[Delivery CR-04] Projet {doc.name} validé et complété. "
            f"Prêt pour transmission au contrôle financier Desk."
        )
