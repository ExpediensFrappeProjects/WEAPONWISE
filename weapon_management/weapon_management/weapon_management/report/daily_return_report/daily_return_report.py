# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):

    columns = ["Return Doc.", "UNIT ID", "Personnel ID", "Rank", "Unit Location", "Weapon Serial Number", "Weapon Butt Number", "Weapon Name", "Ammunition Type", "Ammunition Box ID"]

    data = []

    query = """
        SELECT
            twaar.return_document_number AS "Return Doc.",
            tum.unit_id AS "UNIT ID",
            CONCAT_WS('-', tpm.personnel_id, tpm.full_name) AS "Personnel ID",
            trm.rank_id AS "Rank",
            tum.unit_location AS "Unit Location",
            twaar.weapon_serial_number AS "Weapon Serial Number",
            twaar.butt_number AS "Weapon Butt Number",
            twaar.weapon_name AS "Weapon Name",
            tacm.ammunition_category AS "Ammunition Type",
            twaar.box_number AS "Ammunition Box ID"
        FROM "tabWeapon and Ammunition Return" twaar 
        INNER JOIN "tabUnit Master" tum ON tum."name" = twaar.unit_location
        INNER JOIN "tabPerson Master" tpm ON tpm."name" = twaar.personnel_id
        INNER JOIN "tabRank Master" trm ON trm."name" = twaar."rank"
        INNER JOIN "tabAmmunition Category Master" tacm ON tacm."name" = twaar.ammunition_category
    """

    filters_dict = frappe._dict(filters)

    where_clause = "WHERE 1=1" 

    if filters_dict.get("from_date"):
        where_clause += " AND (twaar.return_date_and_time >= %(from_date)s OR %(from_date)s IS NULL OR %(from_date)s = '')"

    if filters_dict.get("to_date"):
        where_clause += " AND (twaar.return_date_and_time <= %(to_date)s OR %(to_date)s IS NULL OR %(to_date)s = '')"

    if filters_dict.get("unit_id"):
        where_clause += " AND (tum.name LIKE %(unit_id)s OR %(unit_id)s IS NULL OR %(unit_id)s = '')"

    query += where_clause

    result = frappe.db.sql(query, filters_dict, as_dict=True)

    for row in result:
        data_row = [
            row.get("Return Doc."),
            row.get("UNIT ID"),
            row.get("Personnel ID"),
            row.get("Rank"),
            row.get("Unit Location"),
            row.get("Weapon Serial Number"),
            row.get("Weapon Butt Number"),
            row.get("Weapon Name"),
            row.get("Ammunition Type"),
            row.get("Ammunition Box ID")
        ]
        data.append(data_row)

    return columns, data
