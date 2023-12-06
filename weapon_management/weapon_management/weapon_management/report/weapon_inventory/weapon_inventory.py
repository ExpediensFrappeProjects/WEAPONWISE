
import frappe

def execute(filters=None):

    columns = ["Weapon", "No Of Weapon"]

    data = []

    filters_dict = frappe._dict(filters)

    query = """
        SELECT 
            twid.weapon_name AS "Weapon",
            COUNT(twid.weapon_name) AS "No Of Weapon"
        FROM "tabWeapon In Details" twid
        INNER JOIN "tabUnit Master" tum ON twid.unit_location = tum.name
        INNER JOIN "tabWeapon Category Master" twcm ON twid.weapon_category = twcm.name
    """

    where_clause = "WHERE 1=1" 

    if filters_dict.get("unit"):
        where_clause += f" AND tum.name = %(unit)s"
    
    if filters_dict.get("weapon"):
        where_clause += f" AND twid.weapon_name = %(weapon)s"

    if filters_dict.get("from_date") and filters_dict.get("to_date"):
        where_clause += " AND twid.date_acquired BETWEEN %(from_date)s AND %(to_date)s"

    query += where_clause

    query += " GROUP BY twid.weapon_name;"

    result = frappe.db.sql(query, filters_dict, as_dict=True)

    for row in result:
        data_row = [row.get("Weapon"), row.get("No Of Weapon")]
        data.append(data_row)

    return columns, data
