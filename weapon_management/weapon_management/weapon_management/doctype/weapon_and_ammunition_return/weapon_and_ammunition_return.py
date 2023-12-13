# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class WeaponandAmmunitionReturn(Document):
	def before_submit(self):
		# roundsReturned = self.rounds_returned
		# ammunitionRFID = self.ammunition_rfid
		# frappe.db.set_value("Ammunition In Details", {"rfid_tag": ammunitionRFID}, {"rounds_issued": roundsReturned})

		weaponRFID = self.weapon_rfid
		frappe.db.set_value("Weapon In Details", {"rfid_tag": weaponRFID}, {"status": "Available"})

		personID = self.personnel_id
		frappe.db.set_value("Person Master", {"name": personID}, {"weapon_issue_status": "Inactive"})


@frappe.whitelist()
def get_issue_details(personnelRFID):

    sql_query = """
                SELECT unit_location, issue_document_number, date_and_time, duty_code, duty_name, duty_start,  
                       duty_end, duty_location,personnel_id, person_name, rank,weapon_rfid,ammunition_rfid
                FROM `tabWeapon and Ammunition Issue`
                WHERE personnel_rfid = %(personnelRFID)s
                ORDER BY date_and_time DESC 
            """
    issueDetails = frappe.db.sql(sql_query, {"personnelRFID": personnelRFID})
    nested_tuple = issueDetails[0]
    data_list = list(nested_tuple)
    return data_list


@frappe.whitelist()
def get_weapon_details(personnelRFID, issueDocNumber):
    sql_query = """
                SELECT weapon_rfid, weapon_category, weapon_name, weapon_serial_number, weapon_butt_number, weapon_storage_id, weapon_storage_shelf
                FROM `tabWeapon and Ammunition Issue`
                WHERE personnel_rfid = %(personnelRFID)s and issue_document_number = %(issueDocNumber)s
                ORDER BY date_and_time DESC 
        """
    weaponDetails = frappe.db.sql(sql_query, {"personnelRFID": personnelRFID, "issueDocNumber": issueDocNumber})
    nested_tuple = weaponDetails[0]
    data_list = list(nested_tuple)
    return data_list

@frappe.whitelist()
def get_ammunition_details(personnelRFID, issueDocNumber):
    sql_query = """
                SELECT ammunition_rfid,ammunition_category,ammunition_box_id,rounds_issued,ammunition_storage_id,ammunition_storage_shelf
                FROM `tabWeapon and Ammunition Issue`
                WHERE personnel_rfid = %(personnelRFID)s and issue_document_number = %(issueDocNumber)s
                ORDER BY date_and_time DESC 
        """
    ammunitionDetails = frappe.db.sql(sql_query, {"personnelRFID": personnelRFID, "issueDocNumber": issueDocNumber})
    nested_tuple = ammunitionDetails[0]
    data_list = list(nested_tuple)

    return data_list

# @frappe.whitelist()
# def get_issue_details_w(weaponRFID):

#     a = frappe.db.get_value('Weapon In Details', {"rfid_tag": weaponRFID}, ["name","status"])

#     if a:
#         if a[1] == "Issued":
#             sql_query = """
#                 SELECT unit_location, issue_document_number, date_and_time, duty_code, duty_name, duty_start, duty_end, duty_location, 
#                 personnel_rfid,personnel_id, person_name, rank, weapon_category, weapon_name, weapon_serial_number,butt_number, weapon_storage_id,
#                 weapon_storage_shelf,ammunition_rfid, ammunition_category, box_number, rounds_issued, round_per_box,
#                 ammunition_storage_id, ammunition_storage_shelf
#                 FROM `tabWeapon and Ammunition Issue`
#                 WHERE weapon_rfid = %(weaponRFID)s
#                 ORDER BY date_and_time DESC 
#             """
#             issueDetails = frappe.db.sql(sql_query, {"weaponRFID": weaponRFID})
#             nested_tuple = issueDetails[0]
#             data_list = list(nested_tuple)

#             return data_list
#         else:
#             return 1
#     else:
#         return None 


# @frappe.whitelist()
# def get_issue_details_w(weaponRFID):

#     a = frappe.db.get_value('Weapon In Details', {"rfid_tag": weaponRFID}, ["name","status"])

#     if a:
#         sql_query = """
#             SELECT unit_location, issue_document_number, date_and_time, duty_code, duty_name, duty_start, duty_end, duty_location, 
#             personnel_rfid,personnel_id, person_name, rank, weapon_category, weapon_name, weapon_serial_number,butt_number, weapon_storage_id,
#             weapon_storage_shelf,ammunition_rfid, ammunition_category, box_number, rounds_issued, round_per_box,
#             ammunition_storage_id, ammunition_storage_shelf
#             FROM `tabWeapon and Ammunition Issue`
#             WHERE weapon_rfid = %(weaponRFID)s
#             ORDER BY date_and_time DESC 
#             LIMIT 1
#         """
#         issueDetails = frappe.db.sql(sql_query, {"weaponRFID": weaponRFID})
#         nested_tuple = issueDetails[0]
#         data_list = list(nested_tuple)

#         return data_list

#     else:
#         frappe.throw("Wrong RFID")


# @frappe.whitelist()
# def get_issue_details_a(ammunitionRFID):

#     sql_query = """
#         SELECT unit_location, issue_document_number, date_and_time, duty_code, duty_name, duty_start, duty_end, duty_location, 
#         personnel_rfid,personnel_id, person_name, rank, weapon_rfid,weapon_category, weapon_name, weapon_serial_number,butt_number, weapon_storage_id,
#         weapon_storage_shelf, ammunition_category, box_number, rounds_issued, round_per_box,
#         ammunition_storage_id, ammunition_storage_shelf
#         FROM `tabWeapon and Ammunition Issue`
#         WHERE ammunition_rfid = %(ammunitionRFID)s
#         ORDER BY date_and_time desc
#         LIMIT 1
#     """

#     issueDetails = frappe.db.sql(sql_query, {"ammunitionRFID": ammunitionRFID})
#     nested_tuple = issueDetails[0]
#     data_list = list(nested_tuple)
    
#     return data_list


@frappe.whitelist()
def calculate_quantity_used(issuedQuantity, roundsReturned):
	return int(issuedQuantity) - int(roundsReturned)


@frappe.whitelist()
def calculate_empty_case_balance(quantityUsed,emptyCaseReturned):
	return int(quantityUsed) - int(emptyCaseReturned)


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

@frappe.whitelist()
def get_return_doc_num():
    
    last_document = frappe.db.get_list(doctype='Weapon and Ammunition Return', limit=1, order_by='creation desc')

    if last_document:
        doc = frappe.db.get_value("Weapon and Ammunition Return", last_document[0].name, "return_document_number")
        
        if doc:
            prefix = "Return"
            current_return_number = int(doc[len(prefix):])
            next_return_number = current_return_number + 1
            return_doc_num = f"{prefix}{next_return_number}"
        else:
            return_doc_num = "Return1"
    else:
        return_doc_num = "Return1"

    return return_doc_num