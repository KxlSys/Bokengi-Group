# -*- coding: utf-8 -*-
# Copyright (c) 2026, Bokengi Group and contributors
# For license information, please see license.txt

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from ..adapter_interface import IPDPAdapter

class StandaloneExportAdapter(IPDPAdapter):
    """
    Adaptateur Autonome / Export PDF/A-3 Factur-X manuel sans transmission directe PDP.
    """

    @property
    def provider_id(self) -> str:
        return "MANUAL"

    @property
    def supported_formats(self) -> list:
        return ["FACTURX_COMFORT", "FACTURX_BASIC"]

    def transmit_invoice(self, invoice_data: Dict[str, Any], pdf_bytes: bytes, xml_payload: str) -> Dict[str, Any]:
        transmission_id = f"LOCAL-EXP-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        return {
            "transmission_id": transmission_id,
            "status": "ACCEPTED",
            "raw_response": {
                "mode": "MANUAL_EXPORT",
                "export_id": transmission_id,
                "note": "Document scelle et pret pour transmission manuelle ou courriel",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }

    def check_status(self, transmission_id: str) -> Dict[str, Any]:
        return {
            "status": "ACCEPTED",
            "details": "Mode export autonome - document valide",
            "raw_response": {
                "mode": "MANUAL_EXPORT",
                "export_id": transmission_id,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }

    def fetch_receipt(self, transmission_id: str) -> Optional[Dict[str, Any]]:
        return {
            "receipt_id": f"REC-LOCAL-{transmission_id}",
            "legal_timestamp": datetime.utcnow().isoformat() + "Z",
            "provider": "Bokengi Standalone Export"
        }
