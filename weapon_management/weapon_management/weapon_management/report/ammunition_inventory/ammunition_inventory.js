
frappe.query_reports["Ammunition Inventory"] = {
    "filters": [
        {
            "fieldname": "unit",
            "label": __("Unit"),
            "fieldtype": "Link",
            "options": "Unit Master",
            "reqd": 0
        },
        {
            "fieldname": "ammunition_name",
            "label": __("Ammunition Name"),
            "fieldtype": "Link",
            "options": "Ammunition Category Master",
            "reqd": 0
        },
        {
            "fieldname": "from_date",
            "label": __("From Date"),
            "fieldtype": "Date",
            "reqd": 0
        },
        {
            "fieldname": "to_date",
            "label": __("To Date"),
            "fieldtype": "Date",
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
                frappe.query_report.set_filter_value("ammunition_name", "");
                frappe.query_report.set_filter_value("from_date", "");
                frappe.query_report.set_filter_value("to_date", "");
                // Update the report
                frappe.query_report.refresh();
            },
        }
    ]
};
