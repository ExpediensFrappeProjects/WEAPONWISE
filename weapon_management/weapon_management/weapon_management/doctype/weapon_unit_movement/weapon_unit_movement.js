// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt

frappe.ui.form.on('Weapon Unit Movement', {
    weapon_rfid: function(frm) {
        if(!frm.doc.weapon_rfid){
            frm.set_value('weapon_name', '');
            frm.set_value('weapon_serial_number', '');
            frm.set_value('butt_number', '');
            frm.set_value('weapon_category', '');
            frm.set_value('storage_id', '');
            frm.set_value('shelf', '');
            frm.set_value('unit_location', '');
            frm.set_value('new_unit_location', '');
        }    
        var unitLocation; 
        if (frm.doc.weapon_rfid) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_unit_movement.weapon_unit_movement.get_weapon_details',
                args: {
                    rfid: frm.doc.weapon_rfid
                },
                callback: function(response) {
                    var weaponDetails = response.message;
                    console.log(`${weaponDetails}`)
                    frm.set_value('weapon_name', weaponDetails[0][0]);
                    frm.set_value('weapon_serial_number', weaponDetails[0][1]);
                    frm.set_value('butt_number', weaponDetails[0][2]);
                    frm.set_value('weapon_category', weaponDetails[0][3]);
                    frm.set_value('storage_id', weaponDetails[0][4]);
                    frm.set_value('shelf', weaponDetails[0][5]);
                    unitLocation = weaponDetails[1]; 
                    console.log(`${unitLocation}`)
                    frm.set_value('unit_location', unitLocation);
                    frappe.call({
                        method: 'weapon_management.weapon_management.doctype.weapon_unit_movement.weapon_unit_movement.get_authorizer',
                        args: {
                            unitLocation: unitLocation
                        },
                        callback: function(response) {
                            var options = response.message;
                            frm.set_query("authorized_by", function() {
                                return {
                                    filters: [
                                        ["Person Master", "name", "in", options]
                                    ]
                                };
                            });
                        }
                    });

                    frappe.call({
                        method: 'weapon_management.weapon_management.doctype.weapon_unit_movement.weapon_unit_movement.get_armourer',
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

                    frappe.call({
                        method: 'weapon_management.weapon_management.doctype.weapon_unit_movement.weapon_unit_movement.get_incharge',
                        args: {
                            unitLocation: unitLocation
                        },
                        callback: function(response) {
                            var options = response.message;
                            frm.set_query("unit_incharge", function() {
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


frappe.ui.form.on("",{
    refresh:function(frm){
        if (frm.doc.unit_location){
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_unit_movement.weapon_unit_movement.get_authorizer',
                args: {
                    unitLocation: unitLocation
                },
                callback: function(response) {
                    var options = response.message;
                    frm.set_query("authorized_by", function() {
                        return {
                            filters: [
                                ["Person Master", "name", "in", options]
                            ]
                        };
                    });
                }
            });

            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_unit_movement.weapon_unit_movement.get_armourer',
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

            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_unit_movement.weapon_unit_movement.get_incharge',
                args: {
                    unitLocation: unitLocation
                },
                callback: function(response) {
                    var options = response.message;
                    frm.set_query("unit_incharge", function() {
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
})


frappe.ui.form.on("Weapon Unit Movement", {
    new_unit_location: function (frm) {
        frm.set_value("new_storage_id",'')
        frm.set_value("new_shelf",'')
        if (frm.doc.new_unit_location && frm.doc.new_unit_location != frm.doc.unit_location) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_in.weapon_in.get_storage_id',
                args: {
                    unitLocation: frm.doc.new_unit_location
                },
                callback: function (response) {
                  
                        var options = response.message;
                        frm.set_query("new_storage_id", function () {
                            return {
                                filters: [
                                    ["Storage System Master", "storage_system_id", "in", options]
                                ]
                            };
                        });
                  
                }
            });
        }
        else if(!frm.doc.weapon_rfid){
            frappe.msgprint('Select Weapon');
        }
        else{
            frm.set_value("new_unit_location",'');
            frappe.throw("Select Different Location Than Current Location.",'Error');
        } 
    }
});

frappe.ui.form.on("Weapon Unit Movement", {
    new_storage_id: function(frm) {
        if (frm.doc.new_storage_id) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_in.weapon_in.get_shelf_options',
                args: {
                    storageID: frm.doc.new_storage_id
                },
                callback: function(response) {
                    var options = response.message;
                    frm.set_df_property("new_shelf", "options", options);
                }
            });
        }
    }
});


frappe.ui.form.on("Weapon Unit Movement",{
    armourer_id: function(frm){
        frappe.call({
            method:'weapon_management.weapon_management.doctype.weapon_unit_movement.weapon_unit_movement.get_person_name',
            args: {
                personID : frm.doc.armourer_id
            },
            callback: function(response){
                var armourerName = response.message;
                frm.set_value('armourer_name',armourerName)
            }
        })
    }
})


frappe.ui.form.on("Weapon Unit Movement",{
    unit_incharge: function(frm){
        frappe.call({
            method:'weapon_management.weapon_management.doctype.weapon_unit_movement.weapon_unit_movement.get_person_name',
            args: {
                personID : frm.doc.unit_incharge
            },
            callback: function(response){
                var inchargeName = response.message;
                frm.set_value('incharge_name',inchargeName)
            }
        })
    }
})
