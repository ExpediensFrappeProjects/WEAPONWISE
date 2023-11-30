// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Daily Return Report"] = {
	"filters": [
		{
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Datetime",

            "reqd": 0
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
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
                frappe.query_report.set_filter_value("from_date", "");
                frappe.query_report.set_filter_value("to_date", "");
                frappe.query_report.set_filter_value("unit_id", "");
                frappe.query_report.refresh();
            },
        }

	]
};
