import frappe

@frappe.whitelist()
def get_unit_location():
	unitLocation = frappe.db.get_list("Unit Master",pluck="name")
	return unitLocation


@frappe.whitelist()
def get_weapon_category():
	weaponCategory = frappe.db.get_list("Weapon Category Master",pluck="name")
	return weaponCategory


# @frappe.whitelist()
# def get_storage_id(unitLocaion):
# 	storageIDS = frappe.db.get_list("Storage System Master",filters = {unitLocaion},pluck= "storage_system_id" )
# 	return storageIDS

# @frappe.whitelist()
# def get_shelfs(storageID):
# 	parent = frappe.db.get_value("Storage System Master",filters = {storageID},pluck= "name")
# 	shelfs = frappe.db.get_list("Storage System Shelf", filters = {parent},pluck= "shelf" )
# 	return shelfs



	# // function fetchStorageID() {
    # //     frappe.call({
    # //         method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_storage_id',
	# //         args:{
	# // 			unitLocation = unitLocation
	# // 		},
    # //         callback: function(response) {
    # //             var storageIDS = response.message;
    # //         }
    # //     });
    # // }
    # // fetchStorageID();

	# // function fetchShelf() {
    # //     frappe.call({
    # //         method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_shelfs',
	# // 		args:{
	# // 			storageID = storageID
	# // 		},
	# // 		callback: function(response) {
    # //             var shelfs = response.message;
    # //         }
    # //     });
    # // }
    # // fetchShelf();