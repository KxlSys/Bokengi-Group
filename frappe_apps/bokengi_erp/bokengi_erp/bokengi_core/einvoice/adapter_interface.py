# -*- coding: utf-8 -*-
# Copyright (c) 2026, Bokengi Group and contributors
# For license information, please see license.txt

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class IPDPAdapter(ABC):
    """
    Interface universelle pour les connecteurs PDP / PPF / Peppol / Standalone.
    Tout nouveau fournisseur de facturation électronique doit implémenter cette classe abstraite.
    """
    
    @property
    @abstractmethod
    def provider_id(self) -> str:
        """Identifiant unique du fournisseur (ex: 'CHORUS_PRO', 'PDP_AGREED', 'PEPPOL', 'MANUAL')"""
        pass

    @property
    @abstractmethod
    def supported_formats(self) -> list:
        """Liste des formats supportés (ex: ['FACTURX_COMFORT', 'UBL_2_1', 'CII'])"""
        pass

    @abstractmethod
    def transmit_invoice(self, invoice_data: Dict[str, Any], pdf_bytes: bytes, xml_payload: str) -> Dict[str, Any]:
        """
        Transmet la facture hybride à la plateforme.
        Retourne : { 'transmission_id': str, 'status': str, 'raw_response': dict }
        """
        pass

    @abstractmethod
    def check_status(self, transmission_id: str) -> Dict[str, Any]:
        """
        Interroge l'état de traitement de la transmission.
        Retourne : { 'status': str, 'details': str, 'raw_response': dict }
        """
        pass

    @abstractmethod
    def fetch_receipt(self, transmission_id: str) -> Optional[Dict[str, Any]]:
        """
        Récupère l'accusé d'enregistrement légal ou le certificat de dépôt.
        """
        pass
