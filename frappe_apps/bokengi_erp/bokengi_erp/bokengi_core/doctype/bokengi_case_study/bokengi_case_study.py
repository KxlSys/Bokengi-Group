import frappe
from frappe.model.document import Document

class BokengiCaseStudy(Document):
    def validate(self):
        if not self.slug and self.name:
            self.slug = frappe.scrub(self.name)
