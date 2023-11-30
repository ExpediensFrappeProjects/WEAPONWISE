# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):

    columns = ["Unit ID", "Unit Location", "Duty ID", "Duty Description", "Duty Start", "Duty End", "Personnel Assigned", "Authority", "Remarks"]

    data = []

    query = """
        -- Your SQL Query Here
        SELECT
            up.unit_id AS "Unit ID",
            up.unit_location AS "Unit Location",
            dm.duty_name AS "Duty ID",
            dm.duty_description AS "Duty Description",
            dc.duty_start AS "Duty Start",
            dc.duty_end AS "Duty End",
            grouped_dp.personnel_assigned AS "Personnel Assigned",
            CONCAT_WS('-', pm.personnel_id, pm.full_name) AS "Authority",
            dc.remarks AS "Remarks"
        FROM
            "tabDuty Creation" dc
        LEFT JOIN
            "tabDuty Master" dm ON dc.duty_name = dm.name
        LEFT JOIN
            "tabUnit Master" up ON dc.unit_location = up.name
        LEFT JOIN (
            SELECT
                dp.parent,
                STRING_AGG(CONCAT_WS('-', rm.rank_id, pm.personnel_id, dp.person_name), ', ') AS personnel_assigned
            FROM
                "tabDuty Persons Details" dp
            LEFT JOIN "tabRank Master" rm ON dp.rank = rm.name
            LEFT JOIN "tabPerson Master" pm ON dp.personnel_id = pm.name
            GROUP BY dp.parent
        ) AS grouped_dp ON dc.name = grouped_dp.parent
        LEFT JOIN
            "tabPerson Master" pm ON dc.authorized_by = pm.name
    """
    filters_dict = frappe._dict(filters)

    where_clause = "WHERE 1=1" 

    if filters_dict.get("duty_start"):
        where_clause += " AND (dc.duty_start >= %(duty_start)s OR %(duty_start)s IS NULL OR %(duty_start)s = '')"

    if filters_dict.get("duty_end"):
        where_clause += " AND (dc.duty_end <= %(duty_end)s OR %(duty_end)s IS NULL OR %(duty_end)s = '')"

    if filters_dict.get("unit_id"):
        where_clause += " AND (up.name LIKE %(unit_id)s OR %(unit_id)s IS NULL OR %(unit_id)s = '')"

    query += where_clause
    
    result = frappe.db.sql(query, filters_dict, as_dict=True)

    for row in result:
        data_row = [row.get("Unit ID"), row.get("Unit Location"), row.get("Duty ID"), row.get("Duty Description"), row.get("Duty Start"), row.get("Duty End"), row.get("Personnel Assigned"), row.get("Authority"), row.get("Remarks")]
        data.append(data_row)

    return columns, data

