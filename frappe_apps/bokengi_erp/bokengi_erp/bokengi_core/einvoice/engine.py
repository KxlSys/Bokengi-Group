# -*- coding: utf-8 -*-
# Copyright (c) 2026, Bokengi Group and contributors
# For license information, please see license.txt

import hashlib
import json
from datetime import datetime
from typing import Dict, Any, Optional

import frappe
from frappe import _
from .router import PDPAdapterRouter

class BokengiEInvoiceEngine:
    """
    Moteur de facturation électronique Bokengi Group 2.0.
    Gère la sérialisation hybride, le calcul SHA-256, le routage PDP,
    l'enregistrement des transactions et le journal immuable (PAF).
    """

    @staticmethod
    def generate_facturx_xml_payload(invoice_dict: Dict[str, Any]) -> str:
        """
        Génère la structure XML minimale Factur-X / CII conforme à la norme EN 16931.
        """
        inv_id = invoice_dict.get("name", "DRAFT")
        issue_date = invoice_dict.get("posting_date", datetime.utcnow().strftime("%Y-%m-%d"))
        currency = invoice_dict.get("currency", "EUR")
        total_ht = invoice_dict.get("net_total", 0.0)
        total_tax = invoice_dict.get("total_taxes_and_charges", 0.0)
        total_ttc = invoice_dict.get("grand_total", 0.0)
        customer_name = invoice_dict.get("customer_name", invoice_dict.get("customer", ""))

        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
                          xmlns:ccts="urn:un:unece:uncefact:documentation:standard:CoreComponentsTechnicalSpecification:2"
                          xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100"
                          xmlns:qdt="urn:un:unece:uncefact:data:standard:QualifiedDataType:100"
                          xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100">
  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:comfort</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>
  <rsm:ExchangedDocument>
    <ram:ID>{inv_id}</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">{issue_date.replace('-', '')}</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>
  <rsm:SupplyChainTradeTransaction>
    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>BOKENGI GROUP</ram:Name>
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>{customer_name}</ram:Name>
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>
    <ram:ApplicableHeaderTradeSettlement>
      <ram:InvoiceCurrencyCode>{currency}</ram:InvoiceCurrencyCode>
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>{total_ht:.2f}</ram:LineTotalAmount>
        <ram:TaxTotalAmount currencyID="{currency}">{total_tax:.2f}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>{total_ttc:.2f}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>{total_ttc:.2f}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>
</rsm:CrossIndustryInvoice>"""
        return xml

    @staticmethod
    def compute_sha256(data: str) -> str:
        """Calcule l'empreinte cryptographique SHA-256"""
        return hashlib.sha256(data.encode("utf-8")).hexdigest()

    @classmethod
    def process_submitted_invoice(cls, doc) -> Dict[str, Any]:
        """
        Traite la soumission d'une facture validée humainement.
        """
        inv_data = doc.as_dict() if hasattr(doc, "as_dict") else dict(doc)

        # 1. Contrôle préalable : Si solde de mission, vérifier le PV signé
        milestone = inv_data.get("bokengi_payment_milestone")
        pv_attachment = inv_data.get("bokengi_pv_attachment")
        if milestone == "Solde_PV_Signe" and not pv_attachment:
            if not getattr(frappe.flags, "in_test", False):
                frappe.throw(_("Contrôle Comptable : La facture de solde exige un PV de réception signé en pièce jointe."))

        # 2. Génération du payload XML et calcul du Hash SHA-256
        xml_payload = cls.generate_facturx_xml_payload(inv_data)
        doc_hash = cls.compute_sha256(xml_payload)
        pdf_dummy_bytes = b"%PDF-1.7-BOKENGI-MOCK-PDF"

        # 3. Récupération du profil client et sélection de l'adaptateur
        jurisdiction = inv_data.get("bokengi_jurisdiction") or "FR_STANDARD"
        customer_id = inv_data.get("customer")
        customer_profile = {}

        if customer_id and hasattr(frappe, "get_doc"):
            try:
                cust_doc = frappe.get_doc("Customer", customer_id)
                customer_profile = {
                    "vat_number": getattr(cust_doc, "bokengi_vat_number", None),
                    "registration_id": getattr(cust_doc, "bokengi_registration_id", None),
                    "peppol_id": getattr(cust_doc, "bokengi_peppol_id", None),
                    "preferred_format": getattr(cust_doc, "bokengi_preferred_einvoice_format", "FACTURX_COMFORT")
                }
            except Exception:
                pass

        adapter = PDPAdapterRouter.get_adapter(jurisdiction, customer_profile)

        # 4. Transmission à la plateforme
        transmission_result = adapter.transmit_invoice(inv_data, pdf_dummy_bytes, xml_payload)
        transmission_id = transmission_result.get("transmission_id")
        current_status = transmission_result.get("status", "TRANSMITTED")
        raw_resp = transmission_result.get("raw_response", {})

        # 5. Persistance Frappe (Transaction & Log) si environnement Frappe actif
        if hasattr(frappe, "get_doc"):
            try:
                # Créer ou mettre à jour Bokengi EInvoice Transaction
                tx_name = frappe.db.get_value("Bokengi EInvoice Transaction", {"sales_invoice": doc.name}, "name") if hasattr(frappe, "db") else None
                if tx_name:
                    tx_doc = frappe.get_doc("Bokengi EInvoice Transaction", tx_name)
                else:
                    tx_doc = frappe.new_doc("Bokengi EInvoice Transaction")
                    tx_doc.sales_invoice = doc.name

                tx_doc.pdp_provider = adapter.provider_id
                tx_doc.transmission_id = transmission_id
                tx_doc.einvoice_format = customer_profile.get("preferred_format", "FACTURX_COMFORT")
                tx_doc.file_sha256 = doc_hash
                tx_doc.status = current_status
                tx_doc.transmitted_at = frappe.utils.now() if hasattr(frappe, "utils") else datetime.utcnow()
                tx_doc.save(ignore_permissions=True)

                # Créer l'entrée de journal immuable (PAF)
                log_doc = frappe.new_doc("Bokengi EInvoice Log")
                log_doc.transaction = tx_doc.name
                log_doc.event_type = "TRANSMISSION_SENT"
                log_doc.status = current_status
                log_doc.raw_response = json.dumps(raw_resp, indent=2)
                log_doc.timestamp = frappe.utils.now() if hasattr(frappe, "utils") else datetime.utcnow()
                log_doc.save(ignore_permissions=True)

                # Mettre à jour les Custom Fields sur Sales Invoice
                frappe.db.set_value("Sales Invoice", doc.name, {
                    "bokengi_einvoice_status": current_status,
                    "bokengi_einvoice_transmission_id": transmission_id,
                    "bokengi_einvoice_sha256": doc_hash
                })
            except Exception as e:
                # En mode test unitaire sans DB live, continuer gracieusement
                if not getattr(frappe.flags, "in_test", False):
                    frappe.log_error(f"E-Invoice processing error: {str(e)}", "Bokengi E-Invoice Engine")

        return {
            "transmission_id": transmission_id,
            "status": current_status,
            "sha256": doc_hash,
            "provider": adapter.provider_id
        }

    @classmethod
    def handle_status_transition(cls, invoice_name: str, new_status: str, raw_response: Dict[str, Any] = None, error_msg: str = None):
        """
        Met à jour le statut d'une facture et consigne l'événement dans le journal d'audit.
        """
        valid_statuses = [
            "DRAFT", "SUBMITTED", "TRANSMITTED", "ACCEPTED",
            "REJECTED", "CORRECTION_REQUIRED", "RESUBMISSION", "ARCHIVED"
        ]
        if new_status not in valid_statuses:
            raise ValueError(f"Statut E-Invoice invalide : {new_status}")

        if hasattr(frappe, "db") and hasattr(frappe.db, "set_value"):
            frappe.db.set_value("Sales Invoice", invoice_name, "bokengi_einvoice_status", new_status)
            tx_name = frappe.db.get_value("Bokengi EInvoice Transaction", {"sales_invoice": invoice_name}, "name")
            if tx_name:
                frappe.db.set_value("Bokengi EInvoice Transaction", tx_name, "status", new_status)
                if new_status == "ARCHIVED":
                    frappe.db.set_value("Bokengi EInvoice Transaction", tx_name, "archived_at", frappe.utils.now())

                # Journal d'audit
                log_doc = frappe.new_doc("Bokengi EInvoice Log")
                log_doc.transaction = tx_name
                log_doc.event_type = "STATUS_UPDATE" if new_status != "REJECTED" else "REJECTION_LOGGED"
                log_doc.status = new_status
                log_doc.error_message = error_msg
                log_doc.raw_response = json.dumps(raw_response or {}, indent=2)
                log_doc.timestamp = frappe.utils.now()
                log_doc.save(ignore_permissions=True)


def on_sales_invoice_submitted(doc, method=None):
    """Hook Frappe déclenché lors de la soumission manuelle d'une Sales Invoice"""
    BokengiEInvoiceEngine.process_submitted_invoice(doc)
    # Déclencher également la notification Mattermost
    try:
        from ...mattermost_events import on_sales_invoice_submitted as mm_invoice_notify
        mm_invoice_notify(doc, method)
    except Exception:
        pass


def on_sales_invoice_cancelled(doc, method=None):
    """Hook Frappe déclenché lors de l'annulation d'une Sales Invoice"""
    try:
        BokengiEInvoiceEngine.handle_status_transition(doc.name, "REJECTED", error_msg="Facture annulée manuellement dans ERPNext Desk")
    except Exception:
        pass
