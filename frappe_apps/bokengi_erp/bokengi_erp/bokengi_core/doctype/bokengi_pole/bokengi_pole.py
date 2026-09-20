import frappe
from frappe.model.document import Document

class BokengiPole(Document):
    def validate(self):
        if not self.slug and self.name:
            self.slug = frappe.scrub(self.name)
