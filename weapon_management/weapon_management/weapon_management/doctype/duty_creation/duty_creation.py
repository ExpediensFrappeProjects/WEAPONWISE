# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe
from frappe.model.mapper import get_mapped_doc
from frappe.model.document import Document
from frappe.model.naming import make_autoname
from frappe.model.naming import getseries
from frappe import _

class DutyCreation(Document):
    def autoname(self):
        prefix = "DU-"
        now = frappe.utils.now_datetime()
        naming_series = prefix + now.strftime("%m%Y") + ".#####"
        self.name = make_autoname(naming_series, self)



@frappe.whitelist()
def get_authorizer(unitLocation):
    authorizerList = frappe.get_all('Person Master', filters={"assigned_unit": unitLocation, "is_authorizer": "1"}, fields=['name'])
    authorizerList = [name['name'] for name in authorizerList]
    return authorizerList


@frappe.whitelist()
def validate_rank(rank, personnelID):
    rank_get = frappe.db.get_value("Rank Master", {"name": rank}, "name")
    rank_name = frappe.db.get_value("Rank Master", {"name": rank}, "rank_id")
    rank_given = frappe.db.get_value("Person Master", {"name": personnelID}, "rank")
    if rank_get == rank_given:
        return True, rank_name
    else:
        return False, rank_name


@frappe.whitelist()
def get_persons(unitLocation):
    personsList = frappe.db.get_all('Person Master', filters={"assigned_unit":unitLocation}, fields=['name'])
    personsList = [name['name'] for name in personsList]
    return personsList


@frappe.whitelist()
def populate_table_duty(doctitle):
    rank_counts = {}
    doc = frappe.get_doc('Duty Creation', doctitle)

    for row in doc.persons_required:
        rank = row.rank
        num_persons = row.number_of_persons

        if rank in rank_counts:
            rank_counts[rank] += num_persons
        else:
            rank_counts[rank] = num_persons 
    try:
        frappe.db.sql("DELETE FROM `tabDuty Persons Details` WHERE parent=%s", doc.name)
        for rank, count in rank_counts.items():
            for i in range(count):
                frappe.get_doc({
                    "doctype": "Duty Persons Details",
                    "parenttype": "Duty Creation",
                    "parentfield": "assigned_people",
                    "parent": doc.name,
                    "rank": rank
                }).insert(ignore_permissions=True)
        return 'success'
    except Exception as e:
        frappe.msgprint(f"Error while populating child records: {str(e)}")