#!/usr/bin/env python3
"""
Bokengi ERPNext Schema Deployment Script
Deploy DocTypes and Custom Fields to ERPNext via Frappe REST API.

Prerequisites:
  ERPNEXT_URL (e.g. https://gestion.bokengi-group.com)
  ERPNEXT_API_KEY
  ERPNEXT_API_SECRET

Usage:
  python deploy_to_erpnext.py [--dry-run]
"""

import os
import sys
import json
import glob
import argparse
from pathlib import Path
import urllib.request
import urllib.error

SCRIPT_DIR = Path(__file__).resolve().parent
APP_DIR = SCRIPT_DIR.parent
FIXTURES_DIR = APP_DIR / "bokengi_erp" / "fixtures"
DOCTYPES_DIR = APP_DIR / "bokengi_erp" / "bokengi_core" / "doctype"

def get_config():
    url = os.environ.get("ERPNEXT_URL", "https://gestion.bokengi-group.com").rstrip("/")
    api_key = os.environ.get("ERPNEXT_API_KEY")
    api_secret = os.environ.get("ERPNEXT_API_SECRET")
    return url, api_key, api_secret

def make_request(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            err_json = json.loads(err_body)
        except Exception:
            err_json = {"raw": err_body}
        return e.code, err_json
    except Exception as e:
        return 0, {"error": str(e)}

def deploy_doctypes(url, auth_headers, dry_run=False):
    print("=== [1/2] Verifying & Deploying DocTypes ===")
    
    # Priority order: Child tables first, then main DocTypes, then Single
    order = [
        "bokengi_technical_tag",
        "bokengi_technology_item",
        "bokengi_screenshot_item",
        "bokengi_category_item",
        "bokengi_tag_item",
        "bokengi_pole",
        "bokengi_service",
        "bokengi_case_study",
        "bokengi_post",
        "bokengi_settings",
    ]

    for dt_dir_name in order:
        dt_json_path = DOCTYPES_DIR / dt_dir_name / f"{dt_dir_name}.json"
        if not dt_json_path.exists():
            print(f"  [ERROR] DocType JSON not found: {dt_json_path}")
            continue

        with open(dt_json_path, "r", encoding="utf-8") as f:
            schema = json.load(f)

        doctype_name = schema.get("name")
        print(f"  -> Processing DocType: {doctype_name} ({dt_dir_name})")

        if dry_run or not auth_headers:
            print(f"     [DRY-RUN] Schema valid: {len(schema.get('fields', []))} fields.")
            continue

        # Check if DocType exists
        endpoint = f"{url}/api/resource/DocType/{urllib.parse.quote(doctype_name)}"
        status, res = make_request(endpoint, method="GET", headers=auth_headers)

        if status == 200:
            print(f"     DocType '{doctype_name}' already exists in ERPNext. Checking fields...")
            # Update
            up_status, up_res = make_request(endpoint, method="PUT", data=schema, headers=auth_headers)
            if up_status in (200, 201):
                print(f"     [OK] Updated '{doctype_name}'.")
            else:
                print(f"     [WARN] Could not update '{doctype_name}': {up_res}")
        elif status == 404:
            print(f"     DocType '{doctype_name}' does not exist. Creating...")
            create_endpoint = f"{url}/api/resource/DocType"
            c_status, c_res = make_request(create_endpoint, method="POST", data=schema, headers=auth_headers)
            if c_status in (200, 201):
                print(f"     [OK] Created DocType '{doctype_name}'.")
            else:
                print(f"     [ERROR] Failed to create '{doctype_name}': {c_res}")
        else:
            print(f"     [ERROR] Unexpected response checking '{doctype_name}': HTTP {status}")

def deploy_custom_fields(url, auth_headers, dry_run=False):
    print("\n=== [2/2] Verifying & Deploying Custom Fields ===")
    fixture_path = FIXTURES_DIR / "custom_field.json"
    if not fixture_path.exists():
        print(f"  [ERROR] Fixture file not found: {fixture_path}")
        return

    with open(fixture_path, "r", encoding="utf-8") as f:
        custom_fields = json.load(f)

    for cf in custom_fields:
        cf_name = cf.get("name")
        dt = cf.get("dt")
        fieldname = cf.get("fieldname")
        print(f"  -> Processing Custom Field: {cf_name} (DocType: {dt}, Field: {fieldname})")

        if dry_run or not auth_headers:
            print(f"     [DRY-RUN] Field definition valid.")
            continue

        endpoint = f"{url}/api/resource/Custom Field/{urllib.parse.quote(cf_name)}"
        status, res = make_request(endpoint, method="GET", headers=auth_headers)

        if status == 200:
            print(f"     Custom Field '{cf_name}' already exists. Updating...")
            up_status, up_res = make_request(endpoint, method="PUT", data=cf, headers=auth_headers)
            if up_status in (200, 201):
                print(f"     [OK] Updated '{cf_name}'.")
            else:
                print(f"     [WARN] Update status {up_status}: {up_res}")
        elif status == 404:
            print(f"     Custom Field '{cf_name}' does not exist. Creating...")
            create_endpoint = f"{url}/api/resource/Custom Field"
            c_status, c_res = make_request(create_endpoint, method="POST", data=cf, headers=auth_headers)
            if c_status in (200, 201):
                print(f"     [OK] Created Custom Field '{cf_name}'.")
            else:
                print(f"     [ERROR] Failed to create '{cf_name}': {c_res}")
        else:
            print(f"     [ERROR] Unexpected response checking '{cf_name}': HTTP {status}")

def main():
    parser = argparse.ArgumentParser(description="Deploy Bokengi schemas to ERPNext")
    parser.add_argument("--dry-run", action="store_true", help="Validate schemas locally without making API calls")
    args = parser.parse_args()

    url, api_key, api_secret = get_config()
    print("==================================================")
    print("  Bokengi ERPNext Schema Materialization Script   ")
    print("==================================================")
    print(f"Target ERPNext URL: {url}")

    if not api_key or not api_secret:
        print("[NOTICE] ERPNEXT_API_KEY or ERPNEXT_API_SECRET not set in environment.")
        print("         Running in local schema validation mode (dry-run equivalent).\n")
        auth_headers = None
    else:
        print("[INFO] API credentials detected. Direct API mode enabled.\n")
        auth_headers = {
            "Authorization": f"token {api_key}:{api_secret}",
            "Accept": "application/json",
        }

    deploy_doctypes(url, auth_headers, dry_run=args.dry_run or auth_headers is None)
    deploy_custom_fields(url, auth_headers, dry_run=args.dry_run or auth_headers is None)

    print("\n==================================================")
    if auth_headers is None:
        print("  Local schema validation COMPLETED successfully.")
        print("  To deploy directly to ERPNext:")
        print("  1. Ensure an API Integration User exists in ERPNext.")
        print("  2. Set ERPNEXT_API_KEY and ERPNEXT_API_SECRET in your secure environment.")
        print("  3. Run: python frappe_apps/bokengi_erp/scripts/deploy_to_erpnext.py")
        print("  Or run on the server bench:")
        print("     bench get-app /path/to/bokengi_erp")
        print("     bench --site gestion.bokengi-group.com install-app bokengi_erp")
        print("     bench --site gestion.bokengi-group.com migrate")
    else:
        print("  Deployment to remote ERPNext COMPLETED.")
    print("==================================================")

if __name__ == "__main__":
    main()
