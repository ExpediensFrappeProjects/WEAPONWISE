# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class AmmunitionIn(Document):
    def before_save(self):
        if self.document_number:
            self.document_number = self.document_number.upper()
        self.validate_duplicate_document_number()

    def validate_duplicate_document_number(self):
        
        if frappe.get_all(
            "Ammunition In",
            filters={"document_number": self.document_number, "name": ("!=", self.name)},
        ):
            frappe.throw(_("Document Number '{0}' already exists.").format(self.document_number))
    
    def on_submit(self):
        if not self.is_new():
            unitLocation = self.unit_location
            docName = self.name
            frappe.db.begin()
            try:
                update_query = f"""
                    UPDATE `tabAmmunition In Details`
                    SET `unit_location` = %s
                    WHERE `parent` = %s
                """
                frappe.db.sql(update_query, (unitLocation, docName))
                frappe.db.commit()
                frappe.msgprint("Added to Armoury")
            except Exception as e:
                frappe.db.rollback()
                frappe.msgprint(f"Error: {str(e)}")


@frappe.whitelist()
def update_parent_value(unitLocation,docName):

    frappe.db.begin()
    try:
        update_query = f"""
            UPDATE `tabAmmunition In Details`
            SET `unit_location` = %s
            WHERE `parent` = %s
        """
        frappe.db.sql(update_query, (unitLocation, docName))
        frappe.db.commit()
        frappe.msgprint("Added to Armoury")
    except Exception as e:
        frappe.db.rollback()
        frappe.msgprint(f"Error: {str(e)}")

@frappe.whitelist()
def get_storage_id(unitLocation):
    storageIDList = frappe.get_all('Storage System Master', filters={'unit_location': unitLocation}, fields=['storage_system_id'])
    storageIDList = [storage_system_id['storage_system_id'] for storage_system_id in storageIDList]
    return storageIDList


@frappe.whitelist()
def get_shelf_options(storageID):
    shelfList = frappe.get_all('Storage System Shelf', filters={'parent': storageID}, fields=['shelf'])
    shelfList = [shelf['shelf'] for shelf in shelfList]
    return shelfList


@frappe.whitelist()
def get_authorizer(unitLocation):
    authorizerList = frappe.get_all('Person Master', filters={"assigned_unit": unitLocation, "is_authorizer": "1"}, fields=['name'])
    authorizerList = [name['name'] for name in authorizerList]
    return authorizerList