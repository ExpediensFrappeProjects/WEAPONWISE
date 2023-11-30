# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document

class StorageSystemMaster(Document):
    # pass
    def validate(self):
        if self.storage_system_id:
            self.storage_system_id = self.storage_system_id.upper()

            # Check for duplicate storage_system_id only during document creation or when it's changed
            if not self.get("__islocal") and self.storage_system_id != frappe.get_value("Storage System Master", self.name, "storage_system_id"):
                duplicate_storage_ID = frappe.db.get_value(
                    "Storage System Master",
                    {
                        "storage_system_id": self.storage_system_id,
                        "unit_location": self.unit_location,
                    },
                )

                if duplicate_storage_ID:
                    frappe.throw(
                        f"Storage System ID '{self.storage_system_id}' already exists for Unit Location '{self.unit_location}'.")

            # Validate unique shelves for each combination of unit_location and storage_system_id
            shelves = set()
            for shelf in self.storage_system_shelf:
                if hasattr(shelf, 'shelf'):
                    if (self.unit_location, shelf.shelf) in shelves:
                        frappe.throw(f"Duplicate shelf number '{shelf.shelf}' for Unit Location '{self.unit_location}' and Storage System ID '{self.storage_system_id}'.")
                    shelves.add((self.unit_location, shelf.shelf))
