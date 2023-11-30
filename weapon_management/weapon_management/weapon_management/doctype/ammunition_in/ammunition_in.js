// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt


frappe.ui.form.on("Ammunition In", {
    unit_location: function (frm) {
        frm.set_value("authorised_by",'')
        if (frm.doc.unit_location) {
            frm.get_field('unit_location').df.read_only = 1;
            frm.refresh_field('unit_location');
            frm.set_value('document_date', frappe.datetime.nowdate());  
            frm.get_field('document_date').df.read_only = 1;
            frm.refresh_field('document_date');

            frappe.call({
                method: 'weapon_management.weapon_management.doctype.ammunition_in.ammunition_in.get_storage_id',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function (response) {
                    var storageOptions = response.message;
                    frm.fields_dict.ammunition_in_details.grid.get_field("storage_id").get_query = function (doc, cdt, cdn) {
                        return {
                            filters: [
                                ["Storage System Master", "storage_system_id", "in", storageOptions]
                            ]
                        };
                    };
                    frappe.call({
                        method: 'weapon_management.weapon_management.doctype.ammunition_in.ammunition_in.get_authorizer',
                        args: {
                            unitLocation: frm.doc.unit_location
                        },
                        callback: function (response) {
                            var options = response.message;
                            frm.set_query("authorised_by", function () {
                                return {
                                    filters: [
                                        ["Person Master", "name", "in", options]
                                    ]
                                };
                            });
                        }
                    });
                }
            });
        }
    }
});


frappe.ui.form.on("Ammunition In", {
    refresh: function(frm) {
        if (frm.doc.unit_location) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.ammunition_in.ammunition_in.get_storage_id',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function(response) {
                    var storageOptions = response.message;
                    frm.fields_dict.ammunition_in_details.grid.get_field("storage_id").get_query = function(doc, cdt, cdn) {
                        return {
                            filters: [
                                ["Storage System Master", "storage_system_id", "in", storageOptions]
                            ]
                        };
                    };
                }
            });

            frappe.call({
                method: 'weapon_management.weapon_management.doctype.ammunition_in.ammunition_in.get_authorizer',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function(response) {
                    var options = response.message;
                    frm.set_query("authorised_by", function() {
                        return {
                            filters: [
                                ["Person Master", "name", "in", options]
                            ]
                        };
                    });
                }
            });
        }
    }
});


frappe.ui.form.on("Ammunition In Details", {
    storage_id: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        var storageId = row.storage_id;

        if (storageId) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.ammunition_in.ammunition_in.get_shelf_options',
                args: {
                    storageID: storageId
                },
                callback: function(response) {
                    var options = response.message;
                    frm.fields_dict.ammunition_in_details.grid.update_docfield_property(
                        "shelf",
                        "options",
                        [""].concat(options)
                    );
                }
            });
        }
    }
});


frappe.ui.form.on("Ammunition In Details", {
    total_quantity: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        var totalQuantity = row.total_quantity;
        if (frm.doc.__islocal) {
            frappe.model.set_value(cdt, cdn, "available_quantity", totalQuantity);
        }
    }
});


frappe.ui.form.on("Ammunition In Details", {
    refresh: function(frm) {
        if (!frm.doc.is_new) {
            frm.fields_dict.ammunition_in_details.grid.get_field("total_quantity").read_only = 1;
            frm.fields_dict.ammunition_in_details.grid.refresh();
        }
    }
});


frappe.ui.form.on('Ammunition In Details', {
    date_acquired: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        var parent = frm.doc;
        if (child.date_acquired < parent.document_date) {
            frappe.msgprint(__('Date Acquired cannot be earlier than Document Date'));
            frappe.model.set_value(cdt, cdn, 'date_acquired', '');
        }
    }
});
