# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CertificateMaster(Document):
	def validate(self):
		if self.certificate_name:
			self.certificate_name = self.certificate_name.upper()
			duplicate_cert = frappe.db.get_value("Certificate Master", { "certificate_name": self.certificate_name})
			if duplicate_cert:
				frappe.throw(f"Certificate  '{self.certificate_name}' already exists.")

