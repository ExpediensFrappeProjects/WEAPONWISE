# Copyright (c) 2023, Expedien and contributors
# For license information, please see license.txt

import frappe

def execute(filters=None):

    columns = ["Ammunition Name", "Available Ammunition"]

    data = []

    filters_dict = frappe._dict(filters)

    query = """
		select 
		tacm.ammunition_category as "Ammunition Name",
		sum(taid.available_quantity) as "Available Ammunition"
		from "tabAmmunition In Details" taid 
		inner join "tabUnit Master" tum  on taid.unit_location  = tum.name
		inner join "tabAmmunition Category Master" tacm on taid.ammunition_category = tacm.name
		
    """

    where_clause = "WHERE 1=1" 

    if filters_dict.get("unit"):
        where_clause += f" AND tum.name = %(unit)s"
        
    if filters_dict.get("ammunition_name"):
        where_clause += f" AND tacm.name = %(ammunition_name)s"

    query += where_clause

    query += "GROUP BY tacm.ammunition_category  ;"

    result = frappe.db.sql(query, filters_dict, as_dict=True)

    for row in result:
        data_row = [row.get("Ammunition Name"), row.get("Available Ammunition")]
        data.append(data_row)

    return columns, data
