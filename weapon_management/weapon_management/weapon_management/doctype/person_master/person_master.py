# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document

class PersonMaster(Document):
    def validate(self):
        if self.middle_name:
            self.full_name = f'{self.first_name} {self.middle_name} {self.last_name}'
        else:
            self.full_name = f'{self.first_name} {self.last_name}'

        if self.personnel_id:
            self.personnel_id = self.personnel_id.upper()
            duplicate_id = frappe.get_all("Person Master", filters={"personnel_id": self.personnel_id, "name": ("!=", self.name)})
            if duplicate_id:
                frappe.throw(f"Personnel ID '{self.personnel_id}' already exists in another document.")

