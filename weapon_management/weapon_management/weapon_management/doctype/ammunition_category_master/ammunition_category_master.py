# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class AmmunitionCategoryMaster(Document):
    def validate(self):
        if self.ammunition_category:
            self.ammunition_category = self.ammunition_category.upper()
            duplicate_ammu = frappe.get_all("Ammunition Category Master", filters={"ammunition_category": self.ammunition_category, "name": ("!=", self.name)})
            if duplicate_ammu:
                frappe.throw(f"Ammunition Category '{self.ammunition_category}' already exists in another document.")
