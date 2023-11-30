// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt

frappe.query_reports["Ammunition Inventory Details"] = {
    "filters": [
        {
            "fieldname": "unit",
            "label": __("Unit"),
            "fieldtype": "Link",
            "options": "Unit Master",
            "reqd": 0
        },
        {
            "fieldname": "ammunition_category",
            "label": __("Ammunition Category"),
            "fieldtype": "Link",
            "options": "Ammunition Category Master",
            "reqd": 0
        },
        {
            "fieldname": "ammunition_rfid",
            "label": __("Ammunition RFID"),
            "fieldtype": "Data",
            "reqd": 0
        },
        {
            "fieldname": "Clear Filters",
            "label": __("Clear Filters"),
            "fieldtype": "Button",
            "reqd": 0,
            "click": function() {
                // Clear the filter values
                frappe.query_report.set_filter_value("unit", "");
                frappe.query_report.set_filter_value("ammunition_category", "");
				frappe.query_report.set_filter_value("ammunition_rfid","");
				frappe.query_report.refresh();
            },
        }
    ]
};

