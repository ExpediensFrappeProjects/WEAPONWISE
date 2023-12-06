# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt


import frappe

def execute(filters=None):
    columns = ["Ammunition Name", "Available Ammunition"]

    data = []

    filters_dict = frappe._dict(filters)

    query = """
        SELECT 
            tacm.ammunition_category AS "Ammunition Name",
            SUM(taid.available_quantity) AS "Available Ammunition"
        FROM 
            "tabAmmunition In Details" taid 
        INNER JOIN 
            "tabUnit Master" tum ON taid.unit_location = tum.name
        INNER JOIN 
            "tabAmmunition Category Master" tacm ON taid.ammunition_category = tacm.name
    """

    where_clause = "WHERE 1=1" 

    if filters_dict.get("unit"):
        where_clause += f" AND tum.name = %(unit)s"

    if filters_dict.get("ammunition_name"):
        where_clause += f" AND tacm.name = %(ammunition_name)s"

    if filters_dict.get("from_date") and filters_dict.get("to_date"):
        where_clause += " AND taid.date_acquired BETWEEN %(from_date)s AND %(to_date)s"

    query += where_clause

    query += " GROUP BY tacm.ammunition_category;"

    result = frappe.db.sql(query, filters_dict, as_dict=True)

    for row in result:
        data_row = [row.get("Ammunition Name"), row.get("Available Ammunition")]
        data.append(data_row)

    return columns, data
