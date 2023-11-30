# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime
from frappe.utils import now_datetime
from frappe.model.document import Document


class WeaponandAmmunitionIssue(Document):
    def before_submit(self):
        weaponRFID = self.weapon_rfid
        frappe.db.set_value("Weapon In Details", {"rfid_tag": weaponRFID}, {"status": "Issued"})
        
        personRFID = self.personnel_rfid
        frappe.db.set_value("Person Master", {"rf_id": personRFID}, {"weapon_issue_status": "Active"})


@frappe.whitelist()
def duty_name_options(unitLocation):
    current_datetime = datetime.now()
    getDuties = frappe.get_list("Duty Creation", filters={"unit_location":unitLocation,"duty_end": (">", current_datetime)}, pluck="name")
    return getDuties


@frappe.whitelist()
def duty_details(dutyCode):
    current_datetime = datetime.now()
    getDutyDetails = frappe.get_value("Duty Creation", {"name": dutyCode}, ['duty_name','duty_start','duty_end','duty_location'])
    return getDutyDetails


@frappe.whitelist()
def get_rfid(dutyCode):
    sql_query = f"""
            SELECT tpm.rf_id
            FROM "tabPerson Master" tpm
            INNER JOIN "tabDuty Persons Details" tdpd ON tpm.name = tdpd.personnel_id
            INNER JOIN "tabDuty Creation" tdc ON tdpd.parent = tdc.name
            WHERE tdc.name = %s
            """
    rf_ids = frappe.db.sql(sql_query, dutyCode, as_dict=False)
    return [rf_id[0] for rf_id in rf_ids]


@frappe.whitelist()
def get_personnels_details(personnelRFID):
    personnelsDetails = frappe.get_value("Person Master", {"rf_id": personnelRFID, "weapon_issue_status":"Inactive"}, ['name','full_name','rank'])
    if personnelsDetails is None:
        return 1
    else:
        return personnelsDetails


@frappe.whitelist()
def get_weapon_details(weaponRFID, unitLocation):
    # weaponCategoryAssignedList = frappe.get_all("Weapon Category Assigned List", filters={"parent": personnelID}, fields=['weapon_category'])
    # weaponCategoryAssignedList = [weaponCategory['weapon_category'] for weaponCategory in weaponCategoryAssignedList]
    weaponDetails = frappe.get_value("Weapon In Details", {"rfid_tag": weaponRFID,"status":"Available","unit_location":unitLocation}, 
                                                          ['weapon_category', 'weapon_name', 'serial_number', 'butt_number', 'storage_id', 'shelf'])
    if weaponDetails is None:
        return 1
    # weaponCategorySelected = weaponDetails[0]
    # if weaponCategorySelected in weaponCategoryAssignedList:
    elif weaponDetails:
        return weaponDetails
    else:
        return None


@frappe.whitelist()
# def validate_and_get_ammunition_details(ammunition_rfid, weaponCategory,weaponName,unitLocation):

def validate_and_get_ammunition_details(ammunition_rfid,unitLocation):
    # ammunitionCategory = frappe.get_value("Weapon Master", {"weapon_category": weaponCategory,"weapon_name":weaponName}, ['ammunition_category'])
    ammunitionDetails = frappe.get_value("Ammunition In Details", {"rfid_tag": ammunition_rfid,"unit_location":unitLocation}, ['ammunition_category', 'ammunition_box_id', 'available_quantity', 'round_per_box', 'storage_id', 'shelf'])
    if ammunitionDetails is None:
        return 1
    # ammunitionCategorySelected = ammunitionDetails[0]
    # if str(ammunitionCategorySelected) == str(ammunitionCategory):
    elif ammunitionDetails:
        return ammunitionDetails
    else:
        return None


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
def get_person_name(person_id):
    personName = frappe.get_value("Person Master", {"name": person_id}, "full_name")
    return personName