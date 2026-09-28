"""
Module API Whitelisté pour Bokengi Group.
Expose des méthodes de consultation en lecture seule pour les contenus publics publiés.
Aucune donnée CRM ou financière privée n'est accessible via ces endpoints.
"""

import frappe
from frappe import _

def _get_locale(locale: str) -> str:
    """Valide et normalise la locale (défaut 'fr')."""
    return "en" if locale and locale.lower().startswith("en") else "fr"


@frappe.whitelist(allow_guest=True)
def get_poles(locale="fr"):
    """
    Retourne les 5 pôles d'expertise publiés, triés par ordre croissant.
    """
    loc = _get_locale(locale)
    poles = frappe.get_all(
        "Bokengi Pole",
        filters={"status": "Published"},
        fields=[
            "name",
            "slug",
            "icon",
            "order",
            "status",
            f"pole_name_{loc} as localized_name",
            f"short_description_{loc} as shortDescription",
            f"description_{loc} as description",
            f"domains_{loc} as domains",
            f"seo_title_{loc} as seo_title",
            f"seo_description_{loc} as seo_description",
        ],
        order_by="order asc",
    )

    results = []
    for idx, p in enumerate(poles):
        results.append({
            "name": p.get("localized_name") or p.get("name"),
            "slug": p.get("slug"),
            "num": f"0{p.get('order') or idx + 1}",
            "shortDescription": p.get("shortDescription") or "",
            "description": p.get("description") or "",
            "icon": p.get("icon") or "server",
            "order": p.get("order") or idx + 1,
            "status": "published",
            "domains": p.get("domains") or "",
            "seo": {
                "title": p.get("seo_title") or f"{p.get('localized_name')} · Bokengi Group",
                "description": p.get("seo_description") or p.get("shortDescription") or "",
            },
        })
    return results


@frappe.whitelist(allow_guest=True)
def get_pole_by_slug(slug, locale="fr"):
    """
    Retourne le détail d'un pôle d'expertise publié par son slug.
    """
    if not slug:
        return None
    loc = _get_locale(locale)
    poles = frappe.get_all(
        "Bokengi Pole",
        filters={"slug": slug, "status": "Published"},
        fields=[
            "name",
            "slug",
            "icon",
            "order",
            "status",
            f"pole_name_{loc} as localized_name",
            f"short_description_{loc} as shortDescription",
            f"description_{loc} as description",
            f"domains_{loc} as domains",
            f"seo_title_{loc} as seo_title",
            f"seo_description_{loc} as seo_description",
        ],
        limit=1,
    )
    if not poles:
        return None
    p = poles[0]
    return {
        "name": p.get("localized_name") or p.get("name"),
        "slug": p.get("slug"),
        "num": f"0{p.get('order') or 1}",
        "shortDescription": p.get("shortDescription") or "",
        "description": p.get("description") or "",
        "icon": p.get("icon") or "server",
        "order": p.get("order") or 1,
        "status": "published",
        "domains": p.get("domains") or "",
        "seo": {
            "title": p.get("seo_title") or f"{p.get('localized_name')} · Bokengi Group",
            "description": p.get("seo_description") or p.get("shortDescription") or "",
        },
    }


@frappe.whitelist(allow_guest=True)
def get_services(pole_slug=None, locale="fr"):
    """
    Retourne la liste des offres de services publiées.
    """
    loc = _get_locale(locale)
    filters = {"status": "Published"}
    if pole_slug:
        filters["pole"] = pole_slug

    services = frappe.get_all(
        "Bokengi Service",
        filters=filters,
        fields=[
            "name",
            "slug",
            "pole",
            "featured",
            "order",
            "status",
            f"service_title_{loc} as title",
            f"category_{loc} as category",
            f"short_description_{loc} as shortDescription",
            f"content_{loc} as content",
            f"seo_title_{loc} as seo_title",
            f"seo_description_{loc} as seo_description",
        ],
        order_by="order asc",
    )

    results = []
    for s in services:
        # Récupérer les tags techniques associés
        tags = frappe.get_all(
            "Bokengi Technical Tag",
            filters={"parent": s.get("name")},
            fields=["tag_name as tag"],
            order_by="idx asc",
        )
        results.append({
            "title": s.get("title") or "",
            "slug": s.get("slug"),
            "poleSlug": s.get("pole"),
            "category": s.get("category") or "",
            "shortDescription": s.get("shortDescription") or "",
            "content": s.get("content") or "",
            "technicalTags": [{"tag": t.get("tag")} for t in tags],
            "featured": bool(s.get("featured")),
            "order": s.get("order") or 0,
            "status": "published",
        })
    return results


@frappe.whitelist(allow_guest=True)
def get_case_studies(featured=False, locale="fr"):
    """
    Retourne les études de cas / réalisations publiées.
    """
    loc = _get_locale(locale)
    filters = {"status": "Published"}
    if frappe.utils.cint(featured):
        filters["featured"] = 1

    cs_list = frappe.get_all(
        "Bokengi Case Study",
        filters=filters,
        fields=[
            "name",
            "slug",
            "client_name as clientName",
            "published_date as publishedDate",
            "featured",
            "status",
            f"title_{loc} as title",
            f"category_{loc} as category",
            f"summary_{loc} as summary",
            f"context_{loc} as context",
            f"challenge_{loc} as challenge",
            f"solution_{loc} as solution",
            f"results_{loc} as results",
            f"architecture_{loc} as architecture",
            f"seo_title_{loc} as seo_title",
            f"seo_description_{loc} as seo_description",
        ],
        order_by="published_date desc",
    )

    results = []
    for cs in cs_list:
        technologies = frappe.get_all(
            "Bokengi Technology Item",
            filters={"parent": cs.get("name")},
            fields=["technology_name as name"],
            order_by="idx asc",
        )
        screenshots = frappe.get_all(
            "Bokengi Screenshot Item",
            filters={"parent": cs.get("name")},
            fields=["image_url as url", f"caption_{loc} as caption"],
            order_by="idx asc",
        )
        results.append({
            "title": cs.get("title") or "",
            "slug": cs.get("slug"),
            "clientName": cs.get("clientName") or "",
            "category": cs.get("category") or "",
            "summary": cs.get("summary") or "",
            "context": cs.get("context") or "",
            "challenge": cs.get("challenge") or "",
            "solution": cs.get("solution") or "",
            "results": cs.get("results") or "",
            "resultsList": [],
            "technologies": [{"name": t.get("name")} for t in technologies],
            "architecture": cs.get("architecture") or "",
            "featured": bool(cs.get("featured")),
            "publishedDate": str(cs.get("publishedDate") or ""),
            "status": "published",
            "screenshots": [
                {
                    "url": sc.get("url"),
                    "alt": sc.get("caption") or cs.get("title"),
                    "caption": sc.get("caption") or "",
                }
                for sc in screenshots
            ],
            "seo": {
                "title": cs.get("seo_title") or f"{cs.get('title')} — Bokengi Group",
                "description": cs.get("seo_description") or cs.get("summary") or "",
            },
        })
    return results


@frappe.whitelist(allow_guest=True)
def get_case_study_by_slug(slug, locale="fr"):
    """
    Retourne le détail d'une étude de cas publiée par son slug.
    """
    if not slug:
        return None
    loc = _get_locale(locale)
    cs_list = frappe.get_all(
        "Bokengi Case Study",
        filters={"slug": slug, "status": "Published"},
        fields=[
            "name",
            "slug",
            "client_name as clientName",
            "published_date as publishedDate",
            "featured",
            "status",
            f"title_{loc} as title",
            f"category_{loc} as category",
            f"summary_{loc} as summary",
            f"context_{loc} as context",
            f"challenge_{loc} as challenge",
            f"solution_{loc} as solution",
            f"results_{loc} as results",
            f"architecture_{loc} as architecture",
            f"seo_title_{loc} as seo_title",
            f"seo_description_{loc} as seo_description",
        ],
        limit=1,
    )
    if not cs_list:
        return None
    cs = cs_list[0]
    technologies = frappe.get_all(
        "Bokengi Technology Item",
        filters={"parent": cs.get("name")},
        fields=["technology_name as name"],
        order_by="idx asc",
    )
    screenshots = frappe.get_all(
        "Bokengi Screenshot Item",
        filters={"parent": cs.get("name")},
        fields=["image_url as url", f"caption_{loc} as caption"],
        order_by="idx asc",
    )
    return {
        "title": cs.get("title") or "",
        "slug": cs.get("slug"),
        "clientName": cs.get("clientName") or "",
        "category": cs.get("category") or "",
        "summary": cs.get("summary") or "",
        "context": cs.get("context") or "",
        "challenge": cs.get("challenge") or "",
        "solution": cs.get("solution") or "",
        "results": cs.get("results") or "",
        "resultsList": [],
        "technologies": [{"name": t.get("name")} for t in technologies],
        "architecture": cs.get("architecture") or "",
        "featured": bool(cs.get("featured")),
        "publishedDate": str(cs.get("publishedDate") or ""),
        "status": "published",
        "screenshots": [
            {
                "url": sc.get("url"),
                "alt": sc.get("caption") or cs.get("title"),
                "caption": sc.get("caption") or "",
            }
            for sc in screenshots
        ],
        "seo": {
            "title": cs.get("seo_title") or f"{cs.get('title')} — Bokengi Group",
            "description": cs.get("seo_description") or cs.get("summary") or "",
        },
    }


@frappe.whitelist(allow_guest=True)
def get_posts(category=None, limit=50, locale="fr"):
    """
    Retourne la liste des articles d'expertise / publications au statut Published.
    Rejette strictement les brouillons (Draft).
    """
    loc = _get_locale(locale)
    posts = frappe.get_all(
        "Bokengi Post",
        filters={"status": "Published"},
        fields=[
            "name",
            "slug",
            "author",
            "author_name_override",
            "cover_image",
            "published_at as publishedAt",
            "reading_time_minutes as readingTime",
            "status",
            f"title_{loc} as title",
            f"excerpt_{loc} as excerpt",
            f"content_{loc} as content",
            f"seo_title_{loc} as seo_title",
            f"seo_description_{loc} as seo_description",
        ],
        order_by="published_at desc",
        limit=int(limit),
    )

    results = []
    for p in posts:
        categories = frappe.get_all(
            "Bokengi Category Item",
            filters={"parent": p.get("name")},
            fields=["category_name as name"],
            order_by="idx asc",
        )
        cat_names = [c.get("name") for c in categories]

        if category and category.lower() != "all":
            if not any(c.lower() == category.lower() for c in cat_names):
                continue

        tags = frappe.get_all(
            "Bokengi Tag Item",
            filters={"parent": p.get("name")},
            fields=["tag_name as tag"],
            order_by="idx asc",
        )

        results.append({
            "title": p.get("title") or "",
            "slug": p.get("slug"),
            "excerpt": p.get("excerpt") or "",
            "content": p.get("content") or "",
            "author": {
                "name": p.get("author_name_override") or p.get("author") or "Rédaction Bokengi",
            },
            "coverImage": {
                "url": p.get("cover_image") or "/og-image.png",
                "alt": p.get("title") or "",
            },
            "categories": cat_names or ["Actualité"],
            "tags": [t.get("tag") for t in tags],
            "publishedAt": str(p.get("publishedAt") or ""),
            "readingTime": p.get("readingTime") or 5,
            "status": "published",
            "seo": {
                "title": p.get("seo_title") or f"{p.get('title')} — Bokengi Group",
                "description": p.get("seo_description") or p.get("excerpt") or "",
            },
        })

    return results


@frappe.whitelist(allow_guest=True)
def get_post_by_slug(slug, locale="fr"):
    """
    Retourne le détail d'un article par son slug. Rejette strictement les brouillons.
    """
    if not slug:
        return None
    loc = _get_locale(locale)
    posts = frappe.get_all(
        "Bokengi Post",
        filters={"slug": slug, "status": "Published"},
        fields=[
            "name",
            "slug",
            "author",
            "author_name_override",
            "cover_image",
            "published_at as publishedAt",
            "reading_time_minutes as readingTime",
            "status",
            f"title_{loc} as title",
            f"excerpt_{loc} as excerpt",
            f"content_{loc} as content",
            f"seo_title_{loc} as seo_title",
            f"seo_description_{loc} as seo_description",
        ],
        limit=1,
    )
    if not posts:
        return None
    p = posts[0]
    categories = frappe.get_all(
        "Bokengi Category Item",
        filters={"parent": p.get("name")},
        fields=["category_name as name"],
        order_by="idx asc",
    )
    tags = frappe.get_all(
        "Bokengi Tag Item",
        filters={"parent": p.get("name")},
        fields=["tag_name as tag"],
        order_by="idx asc",
    )
    return {
        "title": p.get("title") or "",
        "slug": p.get("slug"),
        "excerpt": p.get("excerpt") or "",
        "content": p.get("content") or "",
        "author": {
            "name": p.get("author_name_override") or p.get("author") or "Rédaction Bokengi",
        },
        "coverImage": {
            "url": p.get("cover_image") or "/og-image.png",
            "alt": p.get("title") or "",
        },
        "categories": [c.get("name") for c in categories] or ["Actualité"],
        "tags": [t.get("tag") for t in tags],
        "publishedAt": str(p.get("publishedAt") or ""),
        "readingTime": p.get("readingTime") or 5,
        "status": "published",
        "seo": {
            "title": p.get("seo_title") or f"{p.get('title')} — Bokengi Group",
            "description": p.get("seo_description") or p.get("excerpt") or "",
        },
    }


@frappe.whitelist()
def get_poles_cockpit_summary():
    """
    Retourne la synthèse opérationnelle des 5 pôles Bokengi Group pour le Desk.
    Applique automatiquement le filtrage RLS (pole_permissions.py) selon l'utilisateur connecté.
    """
    poles_meta = [
        {
            "id": "POL-it",
            "name": "Bokengi IT & Infrastructure",
            "subtitle": "Cloud, Réseaux & Cyber",
            "badge_color": "#64FFDA",
            "icon": "server",
            "accent": "#0066CC",
            "links": [
                {"label": "Projets IT", "url": "/app/project?custom_treatment_pole=POL-it"},
                {"label": "Tickets Support", "url": "/app/issue"},
                {"label": "Saisie Temps", "url": "/app/timesheet"},
            ]
        },
        {
            "id": "POL-digital",
            "name": "Bokengi Digital & Innovation",
            "subtitle": "Web, Mobile & SaaS",
            "badge_color": "#64FFDA",
            "icon": "globe",
            "accent": "#0EA5E9",
            "links": [
                {"label": "Projets Digital", "url": "/app/project?custom_treatment_pole=POL-digital"},
                {"label": "Leads Digital", "url": "/app/lead?custom_treatment_pole=POL-digital"},
                {"label": "Site Web Bokengi", "url": "/app/website"},
            ]
        },
        {
            "id": "POL-business",
            "name": "Bokengi Business Solutions",
            "subtitle": "ERPNext, BI & Process",
            "badge_color": "#F5A623",
            "icon": "briefcase",
            "accent": "#F5A623",
            "links": [
                {"label": "CRM & Leads", "url": "/app/lead?custom_treatment_pole=POL-business"},
                {"label": "Devis & Ventes", "url": "/app/quotation"},
                {"label": "Factures Vente", "url": "/app/sales-invoice"},
            ]
        },
        {
            "id": "POL-consulting",
            "name": "Bokengi Consulting & Stratégie",
            "subtitle": "Audits, Conseil & SI",
            "badge_color": "#64FFDA",
            "icon": "compass",
            "accent": "#8B5CF6",
            "links": [
                {"label": "Projets Conseil", "url": "/app/project?custom_treatment_pole=POL-consulting"},
                {"label": "Devis Cadrage", "url": "/app/quotation"},
                {"label": "Livrables Projets", "url": "/app/project-update"},
            ]
        },
        {
            "id": "POL-events",
            "name": "Bokengi Events & Formations",
            "subtitle": "Tech Events & Formations",
            "badge_color": "#F5A623",
            "icon": "award",
            "accent": "#EC4899",
            "links": [
                {"label": "Projets Events", "url": "/app/project?custom_treatment_pole=POL-events"},
                {"label": "Newsletters", "url": "/app/newsletter"},
                {"label": "Support Events", "url": "/app/issue"},
            ]
        }
    ]

    has_project_pole = frappe.db.has_column("Project", "custom_treatment_pole")
    has_lead_pole = frappe.db.has_column("Lead", "custom_treatment_pole")

    summary = []
    for p in poles_meta:
        pid = p["id"]
        
        proj_count = 0
        if has_project_pole and frappe.has_permission("Project", "read"):
            proj_count = len(frappe.get_list("Project", filters={"custom_treatment_pole": pid, "status": "Open"}, fields=["name"]))
            
        lead_count = 0
        if has_lead_pole and frappe.has_permission("Lead", "read"):
            lead_count = len(frappe.get_list("Lead", filters={"custom_treatment_pole": pid, "status": "Open"}, fields=["name"]))

        summary.append({
            **p,
            "metrics": {
                "active_projects": proj_count,
                "open_leads": lead_count
            }
        })

    return summary


# ==============================================================================
# BOKENGI WORKSPACE HEADER API (GÉNÉRIQUE & MULTI-PÔLES)
# ==============================================================================

BOKENGI_WORKSPACES_REGISTRY = {
    "IT & Infrastructure": {
        "name": "IT & Infrastructure",
        "title": "IT & INFRASTRUCTURE",
        "icon": "server",
        "description": "Systèmes, Réseaux, Cloud, DevOps & Cybersécurité",
        "pole": "POL-it",
        "status": "OPÉRATIONNEL",
        "breadcrumb": "Bokengi Group / Pôles d'Expertise / IT & Infrastructure",
    },
    "Digital & Innovation": {
        "name": "Digital & Innovation",
        "title": "DIGITAL & INNOVATION",
        "icon": "smartphone",
        "description": "Applications Web, Mobiles, Plateformes SaaS & CMS",
        "pole": "POL-digital",
        "status": "OPÉRATIONNEL",
        "breadcrumb": "Bokengi Group / Pôles d'Expertise / Digital & Innovation",
    },
    "Business Solutions": {
        "name": "Business Solutions",
        "title": "BUSINESS SOLUTIONS",
        "icon": "briefcase",
        "description": "Intégration ERPNext, Digitalisation, BI & Facturation",
        "pole": "POL-business",
        "status": "OPÉRATIONNEL",
        "breadcrumb": "Bokengi Group / Pôles d'Expertise / Business Solutions",
    },
    "Consulting & Stratégie": {
        "name": "Consulting & Stratégie",
        "title": "CONSULTING & STRATÉGIE",
        "icon": "compass",
        "description": "Conseil stratégique, Schéma directeur & Audits SI",
        "pole": "POL-consulting",
        "status": "OPÉRATIONNEL",
        "breadcrumb": "Bokengi Group / Pôles d'Expertise / Consulting & Stratégie",
    },
    "Events & Formations": {
        "name": "Events & Formations",
        "title": "EVENTS & FORMATIONS",
        "icon": "award",
        "description": "Événements tech, Hackathons & Programmes de formation",
        "pole": "POL-events",
        "status": "OPÉRATIONNEL",
        "breadcrumb": "Bokengi Group / Pôles d'Expertise / Events & Formations",
    },
    "Bokengi Enterprise Cockpit": {
        "name": "Bokengi Enterprise Cockpit",
        "title": "ENTERPRISE COCKPIT 2.0",
        "icon": "dashboard",
        "description": "Console Consolidée de Pilotage Stratégique & Opérationnel",
        "pole": None,
        "status": "OPÉRATIONNEL",
        "breadcrumb": "Bokengi Group / Direction / Cockpit Enterprise",
    },
}


def _derive_initials(full_name: str = "", name: str = "") -> str:
    """Génère de façon déterministe les 2 initiales d'un utilisateur."""
    source = (full_name or name or "").strip()
    if not source:
        return "BG"
    parts = [p for p in source.replace("-", " ").split() if p]
    if len(parts) >= 2:
        return (parts[0][0] + parts[1][0]).upper()
    elif len(parts) == 1:
        return parts[0][:2].upper()
    return "BG"


@frappe.whitelist()
def get_workspace_header_data(workspace_name="IT & Infrastructure"):
    """
    Retourne les données consolidées et sécurisées pour le composant
    générique Bokengi Workspace Header.
    
    Structure retournée :
    {
      "current_user": { "name", "full_name", "email", "user_image", "initials" },
      "workspace": { "name", "title", "icon", "description", "pole", "status", "breadcrumb" },
      "members": [ { "name", "full_name", "email", "user_image", "initials" }, ... ],
      "total_members": <int>
    }
    """
    if not workspace_name:
        workspace_name = "IT & Infrastructure"

    # 1. Résolution des métadonnées du Workspace (générique avec fallback)
    ws_meta = BOKENGI_WORKSPACES_REGISTRY.get(workspace_name)
    if not ws_meta:
        ws_doc = None
        if hasattr(frappe, "db") and frappe.db.exists("Workspace", workspace_name):
            ws_doc = frappe.get_doc("Workspace", workspace_name)

        ws_title = (ws_doc.title if ws_doc and getattr(ws_doc, "title", None) else workspace_name).upper()
        ws_icon = ws_doc.icon if ws_doc and getattr(ws_doc, "icon", None) else "server"
        ws_meta = {
            "name": workspace_name,
            "title": ws_title,
            "icon": ws_icon,
            "description": f"Console de travail opérationnelle — {workspace_name}",
            "pole": None,
            "status": "OPÉRATIONNEL",
            "breadcrumb": f"Bokengi Group / Espaces / {workspace_name}",
        }

    # 2. Utilisateur connecté (dynamique, zéro valeur en dur)
    session_user_id = (
        frappe.session.user
        if hasattr(frappe, "session") and frappe.session and getattr(frappe.session, "user", None)
        else "Administrator"
    )

    user_fields = ["name", "full_name", "first_name", "last_name", "email", "user_image"]
    cur_user_dict = {}
    if hasattr(frappe, "db") and hasattr(frappe.db, "get_value"):
        cur_user_dict = frappe.db.get_value("User", session_user_id, user_fields, as_dict=True) or {}

    cur_full_name = (
        cur_user_dict.get("full_name")
        or cur_user_dict.get("first_name")
        or session_user_id
    )

    current_user = {
        "name": cur_user_dict.get("name") or session_user_id,
        "full_name": cur_full_name,
        "email": cur_user_dict.get("email") or session_user_id,
        "user_image": cur_user_dict.get("user_image") or None,
        "initials": _derive_initials(cur_full_name, session_user_id),
    }

    # 3. Équipe réellement habilitée à ce Workspace
    from bokengi_erp.bokengi_core.pole_permissions import (
        is_executive_or_admin,
        get_user_allowed_poles,
    )

    workspace_roles = set()
    if hasattr(frappe, "db") and frappe.db.exists("DocType", "Has Role"):
        raw_roles = frappe.get_all(
            "Has Role",
            filters={"parent": workspace_name, "parenttype": "Workspace"},
            fields=["role"],
        )
        workspace_roles = {r.get("role") for r in raw_roles if r.get("role")}

    active_users = []
    if hasattr(frappe, "get_all"):
        active_users = frappe.get_all(
            "User",
            filters={
                "enabled": 1,
                "name": ["not in", ["Guest"]],
            },
            fields=["name", "full_name", "first_name", "last_name", "email", "user_image"],
            order_by="creation asc",
        )

    target_pole = ws_meta.get("pole")
    eligible_members = []
    seen_users = set()

    for u in active_users:
        uid = u.get("name")
        if not uid or uid in seen_users:
            continue

        is_admin = uid in ("Administrator", "Script")
        is_exec = is_executive_or_admin(uid)

        if not is_admin and not is_exec:
            u_roles = set(frappe.get_roles(uid)) if hasattr(frappe, "get_roles") else set()
            if workspace_roles and not (u_roles & workspace_roles):
                continue

            if target_pole:
                u_poles = get_user_allowed_poles(uid)
                if target_pole not in u_poles:
                    continue

        seen_users.add(uid)
        m_full_name = u.get("full_name") or u.get("first_name") or uid
        eligible_members.append({
            "name": uid,
            "full_name": m_full_name,
            "email": u.get("email") or "",
            "user_image": u.get("user_image") or None,
            "initials": _derive_initials(m_full_name, uid),
        })

    total_members = len(eligible_members)

    return {
        "current_user": current_user,
        "workspace": ws_meta,
        "members": eligible_members[:4],
        "total_members": total_members,
    }

