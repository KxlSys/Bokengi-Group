app_name = "bokengi_erp"
app_title = "Bokengi ERP & CMS"
app_publisher = "Direction Technique Bokengi Group"
app_description = "Extension ERPNext & Headless CMS pour Bokengi Group"
app_email = "contact@bokengi-group.com"
app_license = "Proprietary"

# Includes in <head>
# ------------------

# DocType Events (Immutabilité stricte du prospect sur Lead)
# --------------------------------------------------------
doc_events = {
    "Lead": {
        "before_save": "bokengi_erp.bokengi_core.lead_security.validate_lead_immutability"
    }
}

# Fixtures exportables / importables
# ---------------------------------
fixtures = [
    {
        "dt": "Custom Field",
        "filters": [
            [
                "name",
                "in",
                [
                    "Lead-custom_payload_id",
                    "Lead-custom_request_type",
                    "Lead-custom_requested_pole",
                    "Lead-custom_treatment_pole",
                    "Lead-custom_priority",
                    "Lead-custom_original_message",
                    "File-custom_alt_fr",
                    "File-custom_alt_en",
                    "File-custom_caption_fr",
                    "File-custom_caption_en"
                ]
            ]
        ]
    }
]
