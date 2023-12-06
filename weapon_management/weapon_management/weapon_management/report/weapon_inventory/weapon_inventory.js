

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
                frappe.query_report.set_filter_value("unit", "");
                frappe.query_report.set_filter_value("weapon", "");
                frappe.query_report.set_filter_value("from_date", "");
                frappe.query_report.set_filter_value("to_date", "");
                frappe.query_report.refresh();
            },
        }
    ]
};
