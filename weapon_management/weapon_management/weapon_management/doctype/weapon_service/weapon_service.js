// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt

frappe.ui.form.on('Weapon Service', {
    weapon_rfid: function(frm) {
        frm.set_value('weapon_name', '');
        frm.set_value('weapon_serial_number', '');
        frm.set_value('weapon_butt_number', '');
        frm.set_value('weapon_category', '');
        frm.set_value('storage_id', '');
        frm.set_value('shelf', '');
        frm.set_value('unit_location', '');

        if (frm.doc.weapon_rfid) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_service.weapon_service.get_weapon_details',
                args: {
                    rfid: frm.doc.weapon_rfid
                },
                callback: function(response) {
                    var weaponDetails = response.message;
                    if (response.message===1) {
                        frm.set_value('weapon_rfid', '');
                        frappe.throw("Weapon Not Available for Testing.");
                    }else{
                        frm.set_value('weapon_name', weaponDetails[0][0]);
                        frm.set_value('weapon_serial_number', weaponDetails[0][1]);
                        frm.set_value('weapon_butt_number', weaponDetails[0][2]);
                        frm.set_value('weapon_category', weaponDetails[0][3]);
                        frm.set_value('storage_id', weaponDetails[0][4]);
                        frm.set_value('shelf', weaponDetails[0][5]);
                        var unitLocation = weaponDetails[1];
                        frm.set_value('unit_location', unitLocation);

                        frappe.call({
                            method: 'weapon_management.weapon_management.doctype.weapon_service.weapon_service.get_inspector',
                            args: {
                                unitLocation: unitLocation
                            },
                            callback: function(response) {
                                var options = response.message;
                                frm.set_query("inspected_by", function() {
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
        }
    }
});
frappe.ui.form.on('Weapon Service', {
    service_date: function (frm) {
        const dueDate = frm.doc.due_date;
        const serviceDate = frm.doc.service_date;

        if (!dueDate) {
            frappe.msgprint(__('Select Due Date first.'));
            frm.doc.service_date = ''; // Clear the "service_date" field
            refresh_field('service_date'); // Refresh the field to reflect the change
        } else {
            const isValidServiceDate = serviceDate >= dueDate;

            frappe.validated = isValidServiceDate;

            if (!isValidServiceDate) {
                frappe.msgprint(__('Service Date cannot be earlier than Due Date.'));
                frm.doc.service_date = ''; // Clear the "service_date" field
                refresh_field('service_date'); // Refresh the field to reflect the change
            }
        }
    },
});

