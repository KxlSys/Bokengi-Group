app_name = "bokengi_erp"
app_title = "Bokengi ERP & CMS"
app_publisher = "Direction Technique Bokengi Group"
app_description = "Extension ERPNext & Headless CMS pour Bokengi Group"
app_email = "contact@bokengi-group.com"
app_license = "Proprietary"

# Includes in <head>
# ------------------
web_include_css = "/assets/bokengi_erp/css/bokengi_login.css?v=2.4.1"

# DocType Events (Immutabilité stricte du prospect & Notifications Mattermost)
# -------------------------------------------------------------------------
doc_events = {
    "Lead": {
        "before_save": "bokengi_erp.bokengi_core.lead_security.validate_lead_immutability",
        "after_insert": "bokengi_erp.mattermost_events.on_lead_inserted"
    },
    "Quotation": {
        "after_insert": "bokengi_erp.mattermost_events.on_quotation_draft_created",
        "on_submit": "bokengi_erp.mattermost_events.on_quotation_submitted"
    },
    "Sales Order": {
        "on_submit": "bokengi_erp.mattermost_events.on_sales_order_submitted"
    },
    "Sales Invoice": {
        "validate": "bokengi_erp.bokengi_core.einvoice.guards.validate_sales_invoice_manual_submission",
        "on_submit": "bokengi_erp.bokengi_core.einvoice.engine.on_sales_invoice_submitted",
        "on_cancel": "bokengi_erp.bokengi_core.einvoice.engine.on_sales_invoice_cancelled"
    },
    "Project": {
        "validate": [
            "bokengi_erp.bokengi_core.project_delivery.validate_project_completion_acceptance",
            "bokengi_erp.bokengi_core.pole_permissions.propagate_pole_to_project"
        ],
        "on_update": "bokengi_erp.bokengi_core.project_delivery.on_project_completed"
    }
}

# Cloisonnement Serveur par Pôle (Row-Level Security & Access Control)
# ------------------------------------------------------------------
permission_query_conditions = {
    "Lead": "bokengi_erp.bokengi_core.pole_permissions.get_lead_permission_query_conditions",
    "Project": "bokengi_erp.bokengi_core.pole_permissions.get_project_permission_query_conditions",
}

has_permission = {
    "Lead": "bokengi_erp.bokengi_core.pole_permissions.has_lead_permission",
    "Project": "bokengi_erp.bokengi_core.pole_permissions.has_project_permission",
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
                    "Project-custom_requested_pole",
                    "Project-custom_treatment_pole",
                    "File-custom_alt_fr",
                    "File-custom_alt_en",
                    "File-custom_caption_fr",
                    "File-custom_caption_en",
                    "Sales Invoice-bokengi_billing_model",
                    "Sales Invoice-bokengi_jurisdiction",
                    "Sales Invoice-bokengi_payment_milestone",
                    "Sales Invoice-bokengi_deposit_percent",
                    "Sales Invoice-bokengi_pv_attachment",
                    "Sales Invoice-bokengi_einvoice_status",
                    "Sales Invoice-bokengi_einvoice_transmission_id",
                    "Sales Invoice-bokengi_einvoice_sha256",
                    "Customer-bokengi_vat_number",
                    "Customer-bokengi_registration_id",
                    "Customer-bokengi_peppol_id",
                    "Customer-bokengi_pdp_routing_code",
                    "Customer-bokengi_preferred_einvoice_format"
                ]
            ]
        ]
    },
    {
        "dt": "Activity Type",
        "filters": [
            [
                "name",
                "in",
                [
                    "ACT-CADRAGE",
                    "ACT-INGENIERIE",
                    "ACT-VALIDATION",
                    "ACT-RESTITUTION",
                    "ACT-MANAGEMENT",
                    "ACT-AVANTVENTE"
                ]
            ]
        ]
    },
    {
        "dt": "Project Template",
        "filters": [
            [
                "name",
                "in",
                [
                    "TEMPLATE-CYBER",
                    "TEMPLATE-CLOUD",
                    "TEMPLATE-DATA",
                    "TEMPLATE-SOFTENG",
                    "TEMPLATE-STRAT"
                ]
            ]
        ]
    },
    {
        "dt": "Workspace",
        "filters": [
            [
                "name",
                "in",
                [
                    "Bokengi Enterprise Cockpit",
                    "IT & Infrastructure",
                    "Digital & Innovation",
                    "Business Solutions",
                    "Consulting & Stratégie",
                    "Events & Formations"
                ]
            ]
        ]
    },
    {
        "dt": "Number Card",
        "filters": [
            [
                "name",
                "like",
                "Bokengi %"
            ]
        ]
    },
    {
        "dt": "Dashboard Chart",
        "filters": [
            [
                "name",
                "like",
                "Bokengi %"
            ]
        ]
    },
    {
        "dt": "Custom HTML Block",
        "filters": [
            [
                "name",
                "=",
                "Bokengi Cockpit Header"
            ]
        ]
    }
]

