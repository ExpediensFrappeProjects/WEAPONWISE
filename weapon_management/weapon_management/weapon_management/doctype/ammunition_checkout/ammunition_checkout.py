# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class AmmunitionCheckOut(Document):
	pass


@frappe.whitelist()
def get_ammunition_details(issueDocumentNumber):
	details = frappe.get_value("Weapon and Ammunition Issue", {'issue_document_number':issueDocumentNumber},
	                            ['unit_location','duty_code','duty_name','duty_start','duty_end','duty_location','personnel_id','person_name',
								'rank','ammunition_rfid','ammunition_category','box_number','qauntity',
								 'available_quantity','round_per_box','ammunition_storage_id','ammunition_storage_shelf'])
	return details

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
