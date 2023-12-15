# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class AmmunitionIssueToKOTEInCharge(Document):
    def before_save(self):
        ammunitionRFID = self.ammunition_rfid
        frappe.db.set_value("Ammunition In Details", {"rfid_tag": ammunitionRFID}, {"status": "Issued to KOTE In-Charge"})



@frappe.whitelist()
def get_personnels_details(personnelRFID):
    personnelsDetails = frappe.get_value("Person Master", {"rf_id": personnelRFID,"is_armourer":1}, ['name','full_name','rank','assigned_unit'])
    if personnelsDetails is None:
        return 1
    else:
        return personnelsDetails


@frappe.whitelist()
def get_ammunition_details(ammunitionRFID):
    ammunitionDetails = frappe.get_value("Ammunition In Details", {"rfid_tag": ammunitionRFID}, 
                                                                  ['ammunition_category', 'ammunition_box_id', 'date_acquired', 'total_rounds_per_box', 'available_rounds_per_box',
                                                                   'manufacturer', 'manufacturing_date', 'total_empty_cases_returned', 'total_empty_cases_lost', 'storage_id', 'shelf'])
    

    if not ammunitionDetails:
        return 1
    else:
        return ammunitionDetails
