# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class UnitMaster(Document):
	def validate(self):
		if self.unit_id:
			duplicate_unit_id = frappe.db.get_value("Unit Master", {"unit_id": self.unit_id, "name": ("!=", self.name)})
			if duplicate_unit_id:
				frappe.throw(f"Unit ID'{self.unit_id}'already exists.Please choose different Unit ID")
            
