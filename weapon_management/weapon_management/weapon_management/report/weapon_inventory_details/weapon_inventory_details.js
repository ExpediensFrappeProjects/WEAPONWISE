// // Copyright (c) 2023, Expedien and contributors
// // For license information, please see license.txt

frappe.query_reports["Weapon Inventory Details"] = {
	"filters": [
		{
            "fieldname": "unit",
            "label": __("Unit"),
            "fieldtype": "Link",
            "options": "Unit Master",
            "reqd": 0
        },
		{
            "fieldname": "weapon_rfid",
            "label": __("Weapon RFID"),
            "fieldtype": "Data",
            "reqd": 0
        },
        
        {
            "fieldname": "weapon_category",
            "label": __("Weapon Category"),
            "fieldtype": "Link",
            "options": "Weapon Category Master",
            "reqd": 0
        },
        {
            "fieldname": "weapon_status",
            "label": __("Weapon Status"),
            "fieldtype": "Select",
            "options": "Available\nIssued\nDecommissioned\nIn Inspection\nIn Test Fire\nIn Servicing\nFailed in Inspection\nFailed in Test Fire\nFailed in Servicing",
            "reqd": 0
        },
        {
            "fieldname": "Clear Filters",
            "label": __("Clear Filters"),
            "fieldtype": "Button",
            "reqd": 0,
            "click": function() {
                frappe.query_report.set_filter_value("unit", "");
                frappe.query_report.set_filter_value("weapon_category", "");
				frappe.query_report.set_filter_value("weapon_rfid", "");
                frappe.query_report.set_filter_value("weapon_status", "");
				frappe.query_report.refresh();
            },
        }

	]
};


