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
