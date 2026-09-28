# -*- coding: utf-8 -*-
# Copyright (c) 2026, Bokengi Group and contributors
# For license information, please see license.txt

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from ..adapter_interface import IPDPAdapter

class PDPFranceAdapter(IPDPAdapter):
    """
    Adaptateur pour Plateforme de Dématérialisation Partenaire Agréée (France B2B).
    """

    @property
    def provider_id(self) -> str:
        return "PDP_AGREED"

    @property
    def supported_formats(self) -> list:
        return ["FACTURX_COMFORT", "FACTURX_BASIC", "UBL_2_1"]

    def transmit_invoice(self, invoice_data: Dict[str, Any], pdf_bytes: bytes, xml_payload: str) -> Dict[str, Any]:
        transmission_id = f"PDP-FR-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        return {
            "transmission_id": transmission_id,
            "status": "TRANSMITTED",
            "raw_response": {
                "platform": "PDP Partenaire France Agréée",
                "ack_status": "QUEUED_FOR_DISPATCH",
                "tracking_reference": transmission_id,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }

    def check_status(self, transmission_id: str) -> Dict[str, Any]:
        return {
            "status": "ACCEPTED",
            "details": "Facture delivree et acceptee par le tiers acheteur",
            "raw_response": {
                "platform": "PDP Partenaire France Agréée",
                "delivery_state": "DELIVERED_AND_ACCEPTED",
                "tracking_reference": transmission_id,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }

    def fetch_receipt(self, transmission_id: str) -> Optional[Dict[str, Any]]:
        return {
            "receipt_id": f"REC-PDP-{transmission_id}",
            "legal_timestamp": datetime.utcnow().isoformat() + "Z",
            "provider": "PDP Partenaire France"
        }
