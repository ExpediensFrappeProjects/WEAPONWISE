# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):

    columns = ["RFID", "Unit Location","Unit_ID", "Ammunition Category", "Available Ammunition", "Total Ammunition","Acquired Date","Last Issue Date","Last Issued To"]

    data = []

    filters_dict = frappe._dict(filters)

    query = """
        SELECT
            taid.rfid_tag AS "RFID",
            tum.unit_location AS "Unit Location",
			tum.unit_id as "Unit_ID",
            tacm.ammunition_category AS "Ammunition Category",
            taid.available_quantity AS "Available Ammunition",
            taid.total_quantity AS "Total Ammunition",
            taid.date_acquired AS "Acquired Date",
            twaai.creation AS "Last Issue Date",
            twaai.person_name AS "Last Issued To"
        FROM
            "tabAmmunition In Details" taid
        INNER JOIN
            "tabUnit Master" tum ON taid.unit_location = tum.name
        INNER JOIN
            "tabAmmunition Category Master" tacm ON taid.ammunition_category = tacm.name
        LEFT JOIN 
            "tabWeapon and Ammunition Issue" twaai ON taid.rfid_tag = twaai.ammunition_rfid
        WHERE 1=1
    """

    if filters_dict.get("unit"):
        query += f" AND tum.name = %(unit)s"

    if filters_dict.get("ammunition_category"):
        query += f" AND tacm.name = %(ammunition_category)s"

    if filters_dict.get("rfid"):
        query += f" AND taid.rfid_tag = %(rfid)s"

    result = frappe.db.sql(query, filters_dict, as_dict=True)

    for row in result:
        data_row = [row.get("RFID"), row.get("Unit Location"), row.get("Unit_ID"),row.get("Ammunition Category"), row.get("Available Ammunition"), row.get("Total Ammunition"),row.get("Acquired Date"),row.get("Last Issue Date"),row.get("Last Issued To")]
        data.append(data_row)

    return columns, data
