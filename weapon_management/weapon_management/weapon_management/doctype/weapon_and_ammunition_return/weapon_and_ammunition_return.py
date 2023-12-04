# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class WeaponandAmmunitionReturn(Document):
	def before_submit(self):
		returnedQuantity = self.returned
		ammunitionRFID = self.ammunition_rfid
		frappe.db.set_value("Ammunition In Details", {"rfid_tag": ammunitionRFID}, {"available_quantity": returnedQuantity})

		weaponRFID = self.weapon_rfid
		frappe.db.set_value("Weapon In Details", {"rfid_tag": weaponRFID}, {"status": "Available"})

		personID = self.personnel_id
		frappe.db.set_value("Person Master", {"name": personID}, {"weapon_issue_status": "Inactive"})


@frappe.whitelist()
def get_issue_details_w(weaponRFID):
 
    sql_query = """
        SELECT unit_location, issue_document_number, date_and_time, duty_code, duty_name, duty_start, duty_end, duty_location, 
        personnel_id, person_name, rank, weapon_category, weapon_name, weapon_serial_number,butt_number, weapon_storage_id,
        weapon_storage_shelf,ammunition_rfid, ammunition_category, box_number, available_quantity, round_per_box,
        ammunition_storage_id, ammunition_storage_shelf
        FROM `tabWeapon and Ammunition Issue`
        WHERE weapon_rfid = %(weaponRFID)s
    """

    issueDetails = frappe.db.sql(sql_query, {"weaponRFID": weaponRFID})
    nested_tuple = issueDetails[0]
    data_list = list(nested_tuple)
    
    return data_list

# @frappe.whitelist()
# def get_issue_details_a(ammunitionRFID):

#     sql_query = """
#         SELECT unit_location, issue_document_number, date_and_time, duty_code, duty_name, duty_start, duty_end, duty_location, 
#         personnel_id, person_name, rank, weapon_rfid, weapon_category, weapon_name, weapon_serial_number,butt_number, weapon_storage_id,
#         weapon_storage_shelf,ammunition_category, box_number, available_quantity, round_per_box,
#         ammunition_storage_id, ammunition_storage_shelf
#         FROM `tabWeapon and Ammunition Issue`
#         WHERE weapon_rfid = %(ammunitionRFID)s
#     """
    
#     issueDetails = frappe.db.sql(sql_query, {"ammunitionRFID": ammunitionRFID})
#     nested_tuple = issueDetails[0]
#     data_list = list(nested_tuple)
    
#     return data_list


@frappe.whitelist()
def calculate_quantity_used(returned,available_quantity):
	return int(available_quantity) - int(returned)


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
def get_person_name(personID):
    personName = frappe.get_value("Person Master", {"name": personID}, "full_name")
    return personName