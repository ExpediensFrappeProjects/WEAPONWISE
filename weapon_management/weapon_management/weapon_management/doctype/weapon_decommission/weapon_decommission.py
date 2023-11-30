# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class WeaponDecommission(Document):
    def before_save(self):
        weaponRFID = self.weapon_rfid
        frappe.db.set_value("Weapon In Details", {"rfid_tag": weaponRFID}, {"status": "Decommissioned"})

@frappe.whitelist()
def get_weapon_details(rfid):
	weaponDetails = frappe.get_value("Weapon In Details",
	                                {"status":["in",["Available","Failed in Inspection","Failed in Test Fire","Failed in Servicing"]],"rfid_tag":rfid},
									['weapon_name','serial_number','butt_number','weapon_category','storage_id','shelf','parent'])
	if weaponDetails is None:
		return 1
	unitID = weaponDetails[6]
	unitLocation = frappe.get_value("Weapon In",{"name":unitID},['unit_location'])
	return weaponDetails,unitLocation

@frappe.whitelist()
def get_armourer(unitLocation):
	armourerList = frappe.get_all('Person Master', filters={"assigned_unit": unitLocation, "is_armourer": "1"}, fields=['name'])
	armourerList = [name['name'] for name in armourerList]
	return armourerList