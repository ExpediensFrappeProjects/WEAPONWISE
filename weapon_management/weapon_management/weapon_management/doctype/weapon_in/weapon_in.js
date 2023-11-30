// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt

frappe.ui.form.on('Weapon In', {
    unit_location: function(frm) {
        frm.set_value("authorised_by",'') 
        if (frm.doc.unit_location) {
            frm.get_field('unit_location').df.read_only = 1;
            frm.refresh_field('unit_location');
            frm.set_value('document_date', frappe.datetime.nowdate());  
            frm.get_field('document_date').df.read_only = 1;
            frm.refresh_field('document_date');

            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_in.weapon_in.get_storage_id',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function(response) {
                    var storageOptions = response.message;
                    frm.fields_dict.weapon_in_details.grid.get_field("storage_id").get_query = function(doc, cdt, cdn) {
                        return {
                            filters: [
                                ["Storage System Master", "storage_system_id", "in", storageOptions]
                            ]
                        };
                    };

                frappe.call({
                        method: 'weapon_management.weapon_management.doctype.weapon_in.weapon_in.get_authorizer',
                        args: {
                            unitLocation: frm.doc.unit_location
                        },
                        callback: function(response) {
                            var personsOptions = response.message;
                            frm.set_query("authorised_by", function() {
                                return {
                                    filters: [
                                        ["Person Master", "name", "in", personsOptions]
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


frappe.ui.form.on("Weapon In", {
    refresh: function(frm) {
        if (frm.doc.unit_location) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_in.weapon_in.get_storage_id',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function (response) {
                    var storageOptions = response.message;
                    frm.fields_dict.weapon_in_details.grid.get_field("storage_id").get_query = function (doc, cdt, cdn) {
                        return {
                            filters: [
                                ["Storage System Master", "storage_system_id", "in", storageOptions]
                            ]
                        };
                    };
                    frappe.call({
                        method: 'weapon_management.weapon_management.doctype.weapon_in.weapon_in.get_authorizer',
                        args: {
                            unitLocation: frm.doc.unit_location
                        },
                        callback: function (response) {
                            var personsOptions = response.message;
                            frm.set_query("authorised_by", function () {
                                return {
                                    filters: [
                                        ["Person Master", "name", "in", personsOptions]
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


frappe.ui.form.on("Weapon In Details", {
    weapon_category: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        var weapon_category = row.weapon_category;
        if (weapon_category) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_in.weapon_in.get_weapon_names',
                args: {
                    weaponCategory: weapon_category
                },
                callback: function(response) {
                    var options = response.message;
                    console.log(`${options}`)
                    frm.fields_dict.weapon_in_details.grid.update_docfield_property(
                        "weapon_name",
                        "options",
                        [""].concat(options)
                    );
                }
            });
        }
    }
});


frappe.ui.form.on("Weapon In Details", {
    storage_id: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        var storage_id = row.storage_id;
        if (storage_id) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_in.weapon_in.get_shelf_options',
                args: {
                    storageID: storage_id
                },
                callback: function(response) {
                    var options = response.message;
                    frm.fields_dict.weapon_in_details.grid.update_docfield_property(
                        "shelf",
                        "options",
                        [""].concat(options)
                    );
                }
            });
        }
    }
});


frappe.ui.form.on("Weapon In", {
    before_save: function (frm) {
        if (!frm.is_new()){
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_in.weapon_in.update_parent_value',
                args: {
                    unitLocation: frm.doc.unit_location,
                    docName:frm.doc.name
                },
                callback: function (response) {
                    
                }
            });
        }
    }
        
});

frappe.ui.form.on('Weapon In Details', {
    date_acquired: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        var parent = frm.doc;
        if (child.date_acquired < parent.document_date) {
            frappe.msgprint(__('Date Acquired cannot be earlier than Document Date'));
            frappe.model.set_value(cdt, cdn, 'date_acquired', '');
        }
    }
});