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
            "fieldname": "Clear Filters",
            "label": __("Clear Filters"),
            "fieldtype": "Button",
            "reqd": 0,
            "click": function() {
                // Clear the filter values
                frappe.query_report.set_filter_value("unit", "");
                frappe.query_report.set_filter_value("ammunition_name", "");
                // Update the report
                frappe.query_report.refresh();
            },
        }
    ]
};
