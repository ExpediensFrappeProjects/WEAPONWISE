# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class WeaponService(Document):
    def before_save(self):
        if self.result == "Fail":
            weaponRFID = self.weapon_rfid
            frappe.db.set_value("Weapon In Details", {"rfid_tag": weaponRFID}, {"status": "Failed in Service"})

        elif self.result == "Pass":
            weaponRFID = self.weapon_rfid
            frappe.db.set_value("Weapon In Details", {"rfid_tag": weaponRFID}, {"status": "Available"})


@frappe.whitelist()
def get_weapon_details(rfid):
	weaponDetails = frappe.get_value("Weapon In Details",
	                                {"status":["in",["Available","Failed in Test Fire","Failed in Inspection"]],"rfid_tag":rfid},
									['weapon_name','serial_number','butt_number','weapon_category','storage_id','shelf','parent'])
	if weaponDetails is None:
		return 1
	unitID = weaponDetails[6]
	unitLocation = frappe.get_value("Weapon In",{"name":unitID},['unit_location'])
	return weaponDetails,unitLocation

@frappe.whitelist()
def get_inspector(unitLocation):
    inspectorList = frappe.get_all('Person Master', filters={"assigned_unit": unitLocation}, fields=['name'])
    inspectorList = [name['name'] for name in inspectorList]
    return inspectorList