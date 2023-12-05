import frappe
from frappe import _
import json


@frappe.whitelist()
def get_unit_location():
	unitLocation = frappe.db.get_list("Unit Master",pluck="name")
	return unitLocation


@frappe.whitelist()
def get_ammunition_category():
    ammunitionCategory = frappe.db.get_list("Ammunition Category Master",pluck = "ammunition_category")
    return ammunitionCategory


@frappe.whitelist()
def get_authorised_by(unitLocation):
    authorizedBy = frappe.db.get_list("Person Master",{"assigned_unit":unitLocation, "is_authorizer":1},pluck="name")
    return authorizedBy


@frappe.whitelist()
def get_authorizer_name(authorizedBy):
    authorizerName = frappe.db.get_value("Person Master", {"name":authorizedBy},["full_name"])
    return authorizerName


@frappe.whitelist()
def get_storage_id(unitLocation):
    storageIDS = frappe.db.get_list("Storage System Master", {"unit_location": unitLocation}, pluck="storage_system_id")
    return storageIDS


@frappe.whitelist()
def get_shelfs(storageID):
    try:
        name = frappe.db.get_value("Storage System Master", filters={"storage_system_id": storageID}, fieldname="name")

        if name:
            shelfs = frappe.db.get_list("Storage System Shelf", filters={"parent": name}, pluck="shelf")
            return shelfs

        frappe.throw("Field Has Been Cleared")

    except Exception as e:
        frappe.log_error(f"Error in get_shelfs: {str(e)}")

 
@frappe.whitelist()
def save_ammunition_in_document(doc_values, details_data):
    doc_values = json.loads(doc_values)
    details_data = json.loads(details_data)

    doc = frappe.new_doc('Ammunition In')
    doc.update(doc_values)

    for data in details_data:
        storageSystemID = data.get('storage_id')
        storageIDFK = frappe.db.get_value("Storage System Master", {"storage_system_id": storageSystemID}, "name")

        if storageIDFK:
            data['storage_id'] = storageIDFK
            doc.append('ammunition_in_details', data)
        else:
            frappe.throw(f"Please Enter Correct Information")

    doc.insert(ignore_permissions=True) 
    frappe.db.commit()
    
    return True