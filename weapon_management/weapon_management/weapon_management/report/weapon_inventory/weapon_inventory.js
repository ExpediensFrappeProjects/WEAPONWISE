// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt
/* eslint-disable */
frappe.query_reports["Weapon Inventory"] = {
    "filters": [
        {
            "fieldname": "unit",
            "label": __("Unit"),
            "fieldtype": "Link",
            "options": "Unit Master",
            "reqd": 0
        },
        {
            "fieldname": "weapon",
            "label": __("Weapon"),
            "fieldtype": "Link",
            "options": "Weapon Master",
            "reqd": 0
        },
        {
            "fieldname": "Clear Filters",
            "label": __("Clear Filters"),
            "fieldtype": "Button",
            "reqd": 0,
            "click": function() {
                frappe.query_report.set_filter_value("unit", "");
                frappe.query_report.set_filter_value("weapon", "");
                frappe.query_report.refresh();
            },
        }
    ]
};
