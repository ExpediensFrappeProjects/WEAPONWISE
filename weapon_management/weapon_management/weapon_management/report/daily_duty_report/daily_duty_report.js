// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Daily Duty Report"] = {
    "filters": [
        {
            "fieldname": "duty_start",
            "label": __("Duty Start"),
            "fieldtype": "Datetime",

            "reqd": 0
        },
        {
            "fieldname": "duty_end",
            "label": __("Duty End"),
            "fieldtype": "Datetime",
            "reqd": 0
        },
        {
            "fieldname": "unit_id",
            "label": __("Unit"),
            "fieldtype": "Link",
            "options": "Unit Master", // Replace with the actual doctype name
            "reqd": 0
        },
        {
            "fieldname": "Clear",
            "label": __("Clear Filters"),
            "fieldtype": "Button",
			"reqd": 0,
			"click": function() {
                // Clear the filter values and update the report
                frappe.query_report.set_filter_value("duty_start", "");
                frappe.query_report.set_filter_value("duty_end", "");
                frappe.query_report.set_filter_value("unit_id", "");
                frappe.query_report.refresh();
            },
        }
    ]
};

