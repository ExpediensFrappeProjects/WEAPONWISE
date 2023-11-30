# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):

    columns = ["Doc No.", "UNIT ID", "Personnel ID", "Personnel Rank", "Unit Location", "Weapon Serial Number", "Weapon Butt Number", "Weapon Name", "Ammunition Type", "Ammunition Box ID"]

    data = []

    query = """
        SELECT
            twaai.issue_document_number AS "Doc No.",
            tum.unit_id AS "UNIT ID",
            CONCAT_WS('-', tpm.personnel_id, tpm.full_name) AS "Personnel ID",
            trm.rank_id AS "Personnel Rank",
            tum.unit_location AS "Unit Location",
            twaai.weapon_serial_number AS "Weapon Serial Number",
            twaai.butt_number AS "Weapon Butt Number",
            twaai.weapon_name AS "Weapon Name",
            tacm.ammunition_category AS "Ammunition Type",
            twaai.box_number AS "Ammunition Box ID"
        FROM "tabWeapon and Ammunition Issue" twaai
        INNER JOIN "tabUnit Master" tum ON tum."name" = twaai.unit_location
        INNER JOIN "tabPerson Master" tpm ON tpm."name" = twaai.personnel_id
        INNER JOIN "tabRank Master" trm ON trm."name" = twaai."rank"
        INNER JOIN "tabAmmunition Category Master" tacm ON tacm."name" = twaai.ammunition_category
           
    """

    filters_dict = frappe._dict(filters)

    where_clause = "WHERE 1=1" 

    if filters_dict.get("from_date"):
        where_clause += " AND (twaai.date_and_time >= %(from_date)s OR %(from_date)s IS NULL OR %(from_date)s = '')"

    if filters_dict.get("to_date"):
        where_clause += " AND (twaai.date_and_time <= %(to_date)s OR %(to_date)s IS NULL OR %(to_date)s = '')"

    if filters_dict.get("unit_id"):
        where_clause += " AND (tum.name LIKE %(unit_id)s OR %(unit_id)s IS NULL OR %(unit_id)s = '')"

    query += where_clause

    result = frappe.db.sql(query, filters_dict, as_dict=True)

    for row in result:
        data_row = [
            row.get("Doc No."),
            row.get("UNIT ID"),
            row.get("Personnel ID"),
            row.get("Personnel Rank"),
            row.get("Unit Location"),
            row.get("Weapon Serial Number"),
            row.get("Weapon Butt Number"),
            row.get("Weapon Name"),
            row.get("Ammunition Type"),
            row.get("Ammunition Box ID")
        ]
        data.append(data_row)

    return columns, data
