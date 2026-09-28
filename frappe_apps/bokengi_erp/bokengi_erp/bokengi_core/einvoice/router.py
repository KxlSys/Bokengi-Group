# -*- coding: utf-8 -*-
# Copyright (c) 2026, Bokengi Group and contributors
# For license information, please see license.txt

from typing import Dict, Any
from .adapter_interface import IPDPAdapter
from .adapters.chorus_pro import ChorusProAdapter
from .adapters.pdp_france import PDPFranceAdapter
from .adapters.peppol import PeppolAdapter
from .adapters.standalone import StandaloneExportAdapter

class PDPAdapterRouter:
    """
    Routeur sélectionnant dynamiquement l'adaptateur de facturation électronique
    approprié selon le régime juridique (jurisdiction) et le profil client.
    """

    @staticmethod
    def get_adapter(jurisdiction: str = "FR_STANDARD", customer_profile: Dict[str, Any] = None) -> IPDPAdapter:
        if customer_profile is None:
            customer_profile = {}

        # 1. Cas Marchés Publics France / B2G ou Chorus Pro spécifié
        if jurisdiction == "FR_STANDARD" and customer_profile.get("is_public_sector"):
            return ChorusProAdapter()

        # 2. Cas B2B France avec PDP Partenaire
        if jurisdiction == "FR_STANDARD" and customer_profile.get("pdp_provider") == "PDP_AGREED":
            return PDPFranceAdapter()

        # 3. Cas France Standard par défaut (Chorus Pro / Portail Public)
        if jurisdiction == "FR_STANDARD":
            return ChorusProAdapter()

        # 4. Cas Union Européenne ou Export International (Peppol)
        if jurisdiction in ["EU_B2B", "INT_EXPORT"] or customer_profile.get("peppol_id"):
            return PeppolAdapter()

        # 5. Mode par défaut : Export Autonome / Manuel
        return StandaloneExportAdapter()
