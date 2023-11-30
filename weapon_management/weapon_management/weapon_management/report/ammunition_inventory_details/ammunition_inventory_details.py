# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):

    columns = ["RFID", "Unit Location","Unit_ID", "Ammunition Category", "Available Ammunition", "Total Ammunition"]

    data = []

    filters_dict = frappe._dict(filters)

    query = """
        SELECT
            taid.rfid_tag AS "RFID",
            tum.unit_location AS "Unit Location",
			tum.unit_id as "Unit_ID",
            tacm.ammunition_category AS "Ammunition Category",
            taid.available_quantity AS "Available Ammunition",
            taid.total_quantity AS "Total Ammunition"
        FROM
            "tabAmmunition In Details" taid
        INNER JOIN
            "tabUnit Master" tum ON taid.unit_location = tum.name
        INNER JOIN
            "tabAmmunition Category Master" tacm ON taid.ammunition_category = tacm.name
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
        data_row = [row.get("RFID"), row.get("Unit Location"), row.get("Unit_ID"),row.get("Ammunition Category"), row.get("Available Ammunition"), row.get("Total Ammunition")]
        data.append(data_row)

    return columns, data
