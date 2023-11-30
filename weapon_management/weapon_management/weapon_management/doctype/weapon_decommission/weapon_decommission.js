// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt


frappe.ui.form.on('Weapon Decommission', {
    weapon_rfid: function(frm) {
        frm.set_value('weapon_name', '');
        frm.set_value('weapon_serial_number', '');
        frm.set_value('weapon_butt_number', '');
        frm.set_value('weapon_category', '');
        frm.set_value('storage_id', '');
        frm.set_value('shelf', '');
        frm.set_value('unit_location', '');
        frm.set_value('armourer_id','')
        var unitLocation;
        if (frm.doc.weapon_rfid) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_decommission.weapon_decommission.get_weapon_details',
                args: {
                    rfid: frm.doc.weapon_rfid
                },
                callback: function(response) {
                    var weaponDetails = response.message;
                    console.log(`${weaponDetails}`)
                    if (response.message===1) {
                        frm.set_value('weapon_rfid', '');
                        frappe.throw("Weapon Not Available.");
                    }else{
                        frm.set_value('weapon_name', weaponDetails[0][0]);
                        frm.set_value('weapon_serial_number', weaponDetails[0][1]);
                        frm.set_value('weapon_butt_number', weaponDetails[0][2]);
                        frm.set_value('weapon_category', weaponDetails[0][3]);
                        frm.set_value('storage_id', weaponDetails[0][4]);
                        frm.set_value('shelf', weaponDetails[0][5]);
                        unitLocation = weaponDetails[1];
                        frm.set_value('unit_location', unitLocation);
                        frappe.call({
                            method: 'weapon_management.weapon_management.doctype.weapon_decommission.weapon_decommission.get_armourer',
                            args: {
                                unitLocation: unitLocation
                            },
                            callback: function(response) {
                                var options = response.message;
                                frm.set_query("armourer_id", function() {
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

frappe.ui.form.on('Weapon Decommission', {
    decommission_date: function (frm) {
        const entryDate = frm.doc.entry_date;
        const decommissionDate = frm.doc.decommission_date;

        if (!entryDate) {
            frappe.msgprint(__('Select Entry Date first.'));
            frm.doc.decommission_date = ''; // Clear the "decommission_date" field
            refresh_field('decommission_date'); // Refresh the field to reflect the change
        } else {
            const isValidDecommissionDate = decommissionDate >= entryDate;

            frappe.validated = isValidDecommissionDate;

            if (!isValidDecommissionDate) {
                frappe.msgprint(__('Decommission Date cannot be earlier than Entry Date.'));
                frm.doc.decommission_date = ''; // Clear the "decommission_date" field
                refresh_field('decommission_date'); // Refresh the field to reflect the change
            }
        }
    },
});
