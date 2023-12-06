# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):
    columns = ["Weapon RFID", "Weapon Category", "Weapon Name", "Status", "Unit ID", "Unit Location",
               "Weapon Serial Number", "Weapon Butt Number", "Last Issued Date", "Last Issued To", "Acquired Date"]
    data = []
    filters_dict = frappe._dict(filters)

    query = """
    SELECT 
        twid.rfid_tag as "Weapon RFID",
        twid.weapon_category as "Weapon Category",
        twid.weapon_name as "Weapon Name",
        twid.status as "Status",
        tum.unit_location as "Unit Location",
        tum.unit_id as "Unit ID",
        twid.serial_number as "Weapon Serial Number",
        twid.butt_number as "Weapon Butt Number",
        twaai.date_and_time as "Last Issued Date",
        twaai.person_name as "Last Issued To",
        twid.date_acquired as "Acquired Date"
    FROM "tabWeapon In Details" twid
    INNER JOIN "tabUnit Master" tum ON twid.unit_location = tum.name
    LEFT JOIN "tabWeapon and Ammunition Issue" twaai ON twid.rfid_tag = twaai.weapon_rfid
    """

    where_clause = "WHERE 1=1"

    if filters_dict.get("unit"):
        where_clause += f" AND tum.name = %(unit)s"

    if filters_dict.get("weapon_category"):
        where_clause += f" AND twid.weapon_category = %(weapon_category)s"

    if filters_dict.get("weapon_rfid"):
        where_clause += f" AND twid.rfid_tag = %(weapon_rfid)s"

    if filters_dict.get("weapon_status"):
        where_clause += f" AND twid.status = %(weapon_status)s"

    query += where_clause
    query += """
    GROUP BY 
        twid.rfid_tag,
        twid.weapon_category,
        twid.weapon_name,
        twid.status,
        tum.unit_location,
        tum.unit_id,
        twid.serial_number,
        twid.butt_number,
        twaai.date_and_time,
        twaai.person_name,
        twid.date_acquired
    """

    try:
        result = frappe.db.sql(query, filters_dict, as_dict=True)

        for row in result:
            data_row = [row.get("Weapon RFID"), row.get("Weapon Category"), row.get("Weapon Name"), row.get("Status"),
                        row.get("Unit ID"), row.get("Unit Location"), row.get("Weapon Serial Number"),
                        row.get("Weapon Butt Number"), row.get("Last Issued Date"), row.get("Last Issued To"),
                        row.get("Acquired Date")]
            data.append(data_row)

    except Exception as e:
        frappe.log_error(f"Error in custom report execution: {str(e)}")

    return columns, data
