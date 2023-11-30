# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class WeaponCategoryMaster(Document):
	def validate(self):
		if self.weapon_category:
			duplicate_wc = frappe.db.get_value("Weapon Category Master",{"weapon_category":self.weapon_category})
			if duplicate_wc:
				frappe.throw(f"Weapon Category '{self.weapon_category}' already exists.")
