// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt

frappe.ui.form.on("Duty Creation", {
    unit_location: function (frm) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.duty_creation.duty_creation.get_authorizer',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function (response) {
                    var options = response.message;
                    console.log(`${options}`)
                    frm.set_query("authorized_by", function () {
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
);


frappe.ui.form.on("Duty Creation", {
    refresh: function (frm) {
        if(frm.doc.unit_location){
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.duty_creation.duty_creation.get_authorizer',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function (response) {
                    var options = response.message;
                    console.log(`${options}`)
                    frm.set_query("authorized_by", function () {
                        return {
                            filters: [
                                ["Person Master", "name", "in", options]
                            ]
                        };
                    });
                }
            });
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.duty_creation.duty_creation.get_persons',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback:function(response){
                    var options = response.message;
                    frm.set_query("personnel_id","assigned_people", function(cdt,cdn) {
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
    }
);


frappe.ui.form.on("Duty Creation", {
    onload: function (frm) {
        if (frm.doc.__islocal) {
            frm.set_df_property("assign_duty", "hidden", true);
            frm.set_df_property("assigned_people", "hidden", true);
        } else {
            frm.set_df_property("persons_required", "read_only", true);
        }
    },

    refresh: function (frm) {
        if (!frm.doc.__islocal) {
            frm.set_df_property("assign_duty", "hidden", false);
        }
    },

    assign_duty: function (frm) {
        console.log("assign_duty function called");
        frappe.call({
            method: 'weapon_management.weapon_management.doctype.duty_creation.duty_creation.populate_table_duty',
            args: {
                doctitle: frm.doc.name
            },
            callback: function (response) {
                console.log("Server response:", response);
                if (response.message === 'success') {
                    console.log("Before reloading document...");
                    cur_frm.reload_doc();
                    console.log("After reloading document...");
                    
                } else {
                    console.log("Server response indicates an error.");
                }
            },
            error: function (err) {
                console.error("Error during API call:", err);
            }
        });
    }
});


frappe.ui.form.on('Duty Creation', {
    duty_start: function (frm) {
        const today = frappe.datetime.now_date();
        const dutyStart = frm.doc.duty_start;
        const isValidStartDate = dutyStart >= today;

        if (!isValidStartDate) {
            frappe.msgprint(__('Duty Start date cannot be in the past.'));
            frm.set_value('duty_start', '');
            refresh_field('duty_start');
        }
    },

    duty_end: function (frm) {
        const dutyStart = frm.doc.duty_start;
        const dutyEnd = frm.doc.duty_end;

        if (!dutyStart) {
            frappe.msgprint(__('Select Duty Start Date first.'));
            frm.set_value('duty_end', '');
            refresh_field('duty_end');
        } else if (dutyEnd < dutyStart) {
            frappe.msgprint(__('Duty End date cannot be earlier than Duty Start date.'));
            frm.set_value('duty_end', '');
            refresh_field('duty_end');
        }
    }
});


function isRankDuplicate(frm, cdt, rank) {
    let duplicates = frm.doc.persons_required.filter(row => row.rank === rank);
    return duplicates.length > 1;
}

                
frappe.ui.form.on("Duty Number of Persons Required", {
    rank: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        var rank = row.rank;
        if (rank) {
            if (isRankDuplicate(frm, cdt, rank)) {
                frappe.msgprint(`${rank} Rank Already Selected !`);
                frappe.model.set_value(cdt, cdn, 'rank', '');
                frm.refresh_field(cdt);
                return;
            }
        }
    }
});


function isPersonnelIdDuplicate(frm, cdt, personnelID) {
    let duplicates = frm.doc.assigned_people.filter(row => row.personnel_id === personnelID);
    return duplicates.length > 1;
}


frappe.ui.form.on("Duty Persons Details", {
    personnel_id: function (frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        var rank = row.rank;
        var personnelID = row.personnel_id;

        if (rank && personnelID) {
            if (isPersonnelIdDuplicate(frm, cdt, personnelID)) {
                frappe.msgprint("Personnel ID is already selected.");
                frappe.model.set_value(cdt, cdn, 'personnel_id', '');
                frappe.model.set_value(cdt, cdn, 'person_name', '');
                frm.refresh_field(cdt);
                return;
            }

            frappe.call({
                method: 'weapon_management.weapon_management.doctype.duty_creation.duty_creation.validate_rank',
                args: {
                    rank: rank,
                    personnelID: personnelID
                },
                callback: function (response) {
                    var rank_id = response.message[0];
                    var rank_name = response.message[1];
                    if (rank_id === false) {
                        frappe.msgprint(`Select the Person of Rank ${rank_name}`);
                        frappe.model.set_value(cdt, cdn, 'personnel_id', '');
                        frappe.model.set_value(cdt, cdn, 'person_name', '');
                        frm.refresh_field(cdt);
                    }
                }
            });
        }
    }
});