import frappe
from frappe.model.document import Document

class BokengiPost(Document):
    def validate(self):
        if not self.slug and self.name:
            self.slug = frappe.scrub(self.name)
        if not self.reading_time_minutes and self.content_fr:
            # Estimation 200 mots / min
            words = len(frappe.utils.strip_html(self.content_fr).split())
            self.reading_time_minutes = max(1, round(words / 200))
