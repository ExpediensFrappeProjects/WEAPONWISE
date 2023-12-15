frappe.ui.form.on('Weapon and Ammunition Issue',{
    onload : function(frm){
        if (frm.is_new()){
            frappe.call({
                method:'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.get_issue_doc_num',
                callback: function(response){
                    var doc_num = response.message;
                    frm.set_value("issue_document_number",doc_num)
                }
            })
        }
    }
})



frappe.ui.form.on('Weapon and Ammunition Issue', {
    refresh: function (frm) {
        addCustomIconButton(frm, 'weapon_rfid');
        addCustomIconButton(frm, 'ammunition_rfid');
        addCustomIconButton(frm, 'personnel_rfid');
    }
});

function addCustomIconButton(frm, fieldname) {
    var inputWrapper = frm.fields_dict[fieldname].$wrapper;

    inputWrapper.css('position', 'relative');
    inputWrapper.find('.control-input').append(
        `<button class="btn btn-default btn-xs btn-icon custom-icon-button" style="position: absolute; right: .1%; top: 7%;">
            <i class="fa fa-rss"></i>
        </button>`
    );

    inputWrapper.find('.custom-icon-button').on('click', function () {
        frm.set_value(fieldname, '');

        frappe.msgprint("Recieving Response from RFID Reader.......")
        setTimeout(function () {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.get_rfid_latest.get_latest_rfid_data',
                args: {},
                callback: function (response) {
                    var latestRFIDData = response.message.latest_rfid_data;
                    frm.set_value(fieldname, latestRFIDData);
                }
            });
            
        }, 2000);
    });
}


frappe.ui.form.on("Weapon and Ammunition Issue", {
    unit_location: function (frm) {
        frm.set_value('date_and_time','')
        frm.set_value('duty_code','')
        frm.set_value('personnel_id','')
        frm.set_value('authorized_by','')
        frm.set_value('armourer_id','')
        if (frm.doc.unit_location) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.duty_name_options',
                args:{
                    unitLocation: frm.doc.unit_location
                },
                callback: function (response) {
                    var options = response.message;
                    console.log(`${options}`)
                    frm.set_value('date_and_time',frappe.datetime.now_datetime())
                    frm.set_query("duty_code", function () {
                        return {
                            filters: [
                                ["Duty Creation", "name", "in", options]
                            ]
                        };
                    });
                }
            });

            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.get_authorizer',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function (response) {
                    var options = response.message;
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
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.get_armourer',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function (response) {
                    var options = response.message;
                    frm.set_query("armourer_id", function () {
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


frappe.ui.form.on('Weapon and Ammunition Issue', {
    duty_code: function(frm) {
        frm.set_value('duty_name','');
        frm.set_value('duty_start', '');
        frm.set_value('duty_end','');
        frm.set_value('duty_location','');
        frm.set_value('personnel_rfid','')
        if(frm.doc.duty_code){
        frappe.call({
            method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.duty_details',
            args: {
                dutyCode: frm.doc.duty_code
            },
            callback: function(response) {
                var duty_code_options = response.message;
                console.log(duty_code_options);
                frm.set_value('duty_name',duty_code_options[0])
				frm.set_value('duty_start', duty_code_options[1]);
				frm.set_value('duty_end',duty_code_options[2]);
				frm.set_value('duty_location',duty_code_options[3]);
            }
        });
    }
}
});



frappe.ui.form.on('Weapon and Ammunition Issue', {
    
    personnel_rfid: function(frm) {
        frm.set_value('personnel_id', '');
        frm.set_value('person_name', '');
        frm.set_value('rank', '');
        frm.set_value('weapon_rfid', '');
        
        debugger;
        if (frm.doc.personnel_rfid) {
            // frappe.call({
            //     method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.get_rfid',
            //     args: {
            //         dutyCode: frm.doc.duty_code
            //     },
            //     callback: function(response) {
            //         var rfidList = response.message;
            //         if (frm.doc.personnel_rfid && rfidList.includes(frm.doc.personnel_rfid)) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.get_personnels_details',
                args: {
                    personnelRFID: frm.doc.personnel_rfid,
                    unitLocation: frm.doc.unit_location
                },
                callback: function(response) {
                    var personnelDetails = response.message;
                    debugger;
                    if (response.message === 1) {
                        frm.set_value('personnel_rfid', '');
                        frappe.throw("Person Already Possesses Weapon.");
                    } else if(response.message === 2){
        
                        frm.set_value('personnel_rfid', '');
                        frappe.throw("First Select Unit Location!!!.");
                    }else {
                        frm.set_value('personnel_id', personnelDetails[0]);
                        frm.set_value('person_name', personnelDetails[1]);
                        frm.set_value('rank', personnelDetails[2]);
                    }
                }
            });
            // } else {
            //     frappe.throw("Selected Person not Assigned to This Duty.");
            //     frm.set_value('personnel_rfid', '');
            //     return;
            // }
        }
    }
});
//     }}
// });


frappe.ui.form.on('Weapon and Ammunition Issue', {
    weapon_rfid: function(frm) {
        frm.set_value('weapon_name', '');
        frm.set_value('weapon_serial_number', '');
        frm.set_value('weapon_butt_number', '');
        frm.set_value('weapon_storage_shelf', '');
        frm.set_value('weapon_storage_id', '');
        frm.set_value('weapon_category', '');

        if (frm.doc.weapon_rfid) {
            if (frm.doc.personnel_rfid) {
                frappe.call({
                    method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.get_weapon_details',
                    args: {
                        weaponRFID: frm.doc.weapon_rfid,
                        // personnelID: frm.doc.personnel_id,
                        unitLocation: frm.doc.unit_location
                    },
                    callback: function(response) {
                        var weaponDetails = response.message;
                        console.log(`${weaponDetails}`);
                        // if (!response.message) {
                        //     frm.set_value('weapon_rfid', '');
                        //     frappe.throw("Not Authorized for this Weapon.");
                        // } else 
                        if (response.message === 1) {
                            frm.set_value('weapon_rfid', '');
                            frappe.throw("Weapon Not Available.");
                        } else {
                            frm.set_value('weapon_category', weaponDetails[0]);
                            frm.set_value('weapon_name', weaponDetails[1]);
                            frm.set_value('weapon_serial_number', weaponDetails[2]);
                            frm.set_value('weapon_butt_number', weaponDetails[3]);
                            frm.set_value('weapon_storage_id', weaponDetails[4]);
                            frm.set_value('weapon_storage_shelf', weaponDetails[5]);
                        }
                    }
                });
            } else {
                frm.set_value('weapon_rfid', '');
                frappe.throw("Enter Personnel RFID");
            }
        }
    }
});


frappe.ui.form.on('Weapon and Ammunition Issue', {
    ammunition_rfid: function(frm) {
        frm.set_value('ammunition_category','');
        frm.set_value('ammunition_box_id','');
        frm.set_value('ammunition_storage_id','');
        frm.set_value('ammunition_storage_shelf','');
        frm.set_value('rounds_issued','')

        if (frm.doc.ammunition_rfid) {
            if (frm.doc.personnel_rfid) {
                frappe.call({
                    method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.validate_and_get_ammunition_details',
                    args: {
                        ammunition_rfid: frm.doc.ammunition_rfid,
                        // weaponCategory: frm.doc.weapon_category,
                        // weaponName: frm.doc.weapon_name,
                        unitLocation: frm.doc.unit_location
                    },
                    callback: function(response) {
                        var ammunitionDetails = response.message;
                        console.log(`${ammunitionDetails}`)
                        // if (!ammunitionDetails) { 
                        //     frm.set_value('ammunition_rfid', '');
                        //     frappe.throw("This ammunition is not for the selected weapon.");
                        // } else if(response.message === 1){
                        //     frm.set_value('ammunition_rfid', '');
                        //     frappe.throw("Wrong Ammunition RFID.");
                        // } else {
                            frm.set_value('ammunition_category', ammunitionDetails[0]);
                            frm.set_value('ammunition_box_id', ammunitionDetails[1]);
                            frm.set_value('ammunition_storage_id', ammunitionDetails[2]);
                            frm.set_value('ammunition_storage_shelf', ammunitionDetails[3]);
                        // }
                    }
                });
            } else {
                frm.set_value('ammunition_rfid', '');
                frappe.throw("Enter Personnel RFID");
            }
        }
    }
});


frappe.ui.form.on("Weapon and Ammunition Return",{
	refresh:function(frm){
		if(frm.doc.unit_location){
			frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.get_authorizer',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function (response) {
                    var options = response.message;
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
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.get_armourer',
                args: {
                    unitLocation: frm.doc.unit_location
                },
                callback: function (response) {
                    var options = response.message;
                    frm.set_query("armourer_id", function () {
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


frappe.ui.form.on('Weapon and Ammunition Issue',{
    armourer_id: function(frm){
        frappe.call({
            method:'weapon_management.weapon_management.doctype.weapon_and_ammunition_issue.weapon_and_ammunition_issue.get_person_name',
            args: {
                person_id : frm.doc.armourer_id
            },
            callback: function(response){
                var armourerName = response.message;
                console.log(`${response.message}`)
                frm.set_value('armourer_name',armourerName)
            }
        })
    }
})


