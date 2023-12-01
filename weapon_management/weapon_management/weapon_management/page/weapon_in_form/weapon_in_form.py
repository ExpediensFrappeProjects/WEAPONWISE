import frappe


@frappe.whitelist()
def get_unit_location():
	unitLocation = frappe.db.get_list("Unit Master",pluck="name")
	return unitLocation


@frappe.whitelist()
def get_weapon_name():
	weaponName = frappe.db.get_list("Weapon Master",pluck="name")
	return weaponName


@frappe.whitelist()
def get_weapon_category(weaponName):
    weaponCategory = frappe.db.get_value("Weapon Master", {"name":weaponName},["weapon_category"])
    return weaponCategory


@frappe.whitelist()
def get_storage_id(unitLocation):
    storageIDS = frappe.db.get_list("Storage System Master", filters={"unit_location": unitLocation}, pluck="storage_system_id")
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