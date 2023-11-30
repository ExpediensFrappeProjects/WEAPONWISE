# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document

class WeaponUnitMovement(Document):
    def before_insert(self):
        doc = frappe.new_doc('Weapon In')
        doc.unit_location = self.unit_location
        doc.document_number = ''
        doc.document_date = ''
        doc.append('weapon_in_details', {
            'weapon_category': self.weapon_category,
            'weapon_name': self.weapon_name,
            'unit': '',
            'serial_number': self.weapon_serial_number,
            'butt_number': self.butt_number,
            'date_acquired': '',
            'storage_id': self.storage_id,
            'shelf': self.shelf,
            'rfid_tag': self.weapon_rfid
        })
        doc.authorised_by = self.authorized_by
        doc.authorizer_name = self.authorizer_name
        doc.source = ''
        doc.remarks = ''
        doc.insert()


@frappe.whitelist()
def get_weapon_details(rfid):
    weaponDetails = frappe.get_value("Weapon In Details", {"rfid_tag": rfid}, ['weapon_name', 'serial_number', 'butt_number', 'weapon_category', 'storage_id', 'shelf', 'parent'])
    unitID = weaponDetails[4]
    unitLocation = frappe.get_value("Weapon In", {"name": unitID}, ['unit_location'])
    frappe.msgprint(str(unitLocation))
    return weaponDetails, unitLocation


@frappe.whitelist()
def get_authorizer(unitLocation):
    authorizerList = frappe.get_all('Person Master', filters={"assigned_unit": unitLocation, "is_authorizer": "1"}, fields=['name'])
    authorizerList = [name['name'] for name in authorizerList]
    return authorizerList


@frappe.whitelist()
def get_armourer(unitLocation):
    armourerList = frappe.get_all('Person Master', filters={"assigned_unit": unitLocation, "is_armourer": "1"}, fields=['name'])
    armourerList = [name['name'] for name in armourerList]
    return armourerList


@frappe.whitelist()
def get_incharge(unitLocation):
    inchargeList = frappe.get_all('Person Master', filters={"assigned_unit": unitLocation, "is_incharge": "1"}, fields=['name'])
    inchargeList = [name['name'] for name in inchargeList]
    return inchargeList


@frappe.whitelist()
def get_person_name(personID):
    personName = frappe.get_value("Person Master", {"name": personID}, "full_name")
    return personName