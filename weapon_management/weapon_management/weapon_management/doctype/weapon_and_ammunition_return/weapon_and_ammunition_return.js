// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt

frappe.ui.form.on('Weapon and Ammunition Return',{
    onload : function(frm){
        if (frm.is_new()){
            frappe.call({
                method:'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_return_doc_num',
                callback: function(response){
                    var doc_num = response.message;
                    frm.set_value("return_document_number",doc_num)
                }
            })
        }
    }
})
frappe.ui.form.on('Weapon and Ammunition Return', {
    refresh: function (frm) {
        addCustomIconButton(frm, 'personnel_rfid');
        addCustomIconButton(frm, 'weapon_rfid');
        // addCustomIconButton(frm, 'ammunition_rfid');  
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




frappe.ui.form.on('Weapon and Ammunition Return',{
    personnel_rfid:function(frm){
        frm.set_value('issue_document_number','');
        frm.set_value('unit_location','');
        frm.set_value('issue_data_and_time','');
        frm.set_value('duty_code','');
        frm.set_value('duty_name','');
        frm.set_value('duty_start', '');
        frm.set_value('duty_end','');
        frm.set_value('duty_location', '');
        frm.set_value('personnel_id','');
        frm.set_value('person_name','');
        frm.set_value('rank','');
        frm.set_value('weapon_rfid','');
        frm.set_value('ammunition_rfid', '');
        frm.set_value('ammunition_rfid','');
        frm.set_value('ammunition_category','');
        frm.set_value('box_number','');
        frm.set_value('rounds_issued','');
        frm.set_value('round_per_box','');
        frm.set_value('ammunition_storage_id','');
        frm.set_value('ammunition_storage_shelf','');

        var unitLocation;
        if (frm.doc.personnel_rfid){
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_issue_details',
                args: {
                    personnelRFID : frm.doc.personnel_rfid
                },
                callback: function(response){
                    var issueDetails = response.message;
                    console.log(`${issueDetails[0]}`)
                    frm.set_value('issue_document_number',issueDetails[1])
                    frm.set_value('issue_data_and_time', issueDetails[2]);
                    frm.set_value('duty_code', issueDetails[3]);
                    frm.set_value('duty_name', issueDetails[4]);
                    frm.set_value('duty_start', issueDetails[5]);
                    frm.set_value('duty_end', issueDetails[6]);
                    frm.set_value('duty_location', issueDetails[7]);
                    frm.set_value('personnel_id', issueDetails[8]);
                    frm.set_value('person_name', issueDetails[9]);
                    frm.set_value('rank', issueDetails[10]);
                    // frm.set_value('weapon_rfid', issueDetails[11]);
                    // frm.set_value('ammunition_rfid', issueDetails[12]);

                    unitLocation = issueDetails[0];

                    frm.set_value('unit_location', unitLocation);
                    frappe.call({
                        method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_authorizer',
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
                        method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_armourer',
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
            })
        }
    }

})

frappe.ui.form.on('Weapon and Ammunition Return', {
    weapon_rfid: function(frm) {
        frm.set_value('weapon_category', '');
        frm.set_value('weapon_name', '');
        frm.set_value('weapon_serial_number', '');
        frm.set_value('butt_number', '');
        frm.set_value('weapon_storage_id', '');
        frm.set_value('weapon_storage_shelf', '');

        var weaponRFIDValue;

        if (frm.doc.weapon_rfid) {
            weaponRFIDValue = frm.doc.weapon_rfid;
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_weapon_details',
                args: {
                    personnelRFID : frm.doc.personnel_rfid,
                    issueDocNumber : frm.doc.issue_document_number
                },
                callback: function(response) {
                    var weaponDetails = response.message;
                    if (weaponDetails[0] == weaponRFIDValue) {
                        frm.set_value('weapon_category', weaponDetails[1]);
                        frm.set_value('weapon_name', weaponDetails[2]);
                        frm.set_value('weapon_serial_number', weaponDetails[3]);
                        frm.set_value('butt_number', weaponDetails[4]);
                        frm.set_value('weapon_storage_id', weaponDetails[5]);
                        frm.set_value('weapon_storage_shelf', weaponDetails[6]);
                    } else {
                        frm.set_value('weapon_rfid', '');
                        frappe.throw("This Weapon Not Issued to Selected Personnel.");
                    }
                }
            });
        }
    }
});


frappe.ui.form.on('Weapon and Ammunition Return', {
    click_to_return_ammunition: function(frm) {
        if (frm.doc.personnel_rfid) {
            frappe.confirm('Are you sure, you want to return "Ammunition"?',
                () => {
                    frappe.call({
                        method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_ammunition_details',
                        args: {
                            personnelRFID: frm.doc.personnel_rfid,
                            issueDocNumber: frm.doc.issue_document_number
                        },
                        callback: function(response) {
                            var issueDetails = response.message;    
                            frm.set_value('ammunition_rfid', issueDetails[0]);
                            frm.set_value('ammunition_category', issueDetails[1]);
                            frm.set_value('box_number', issueDetails[2]);
                            frm.set_value('rounds_issued', issueDetails[3]);
                            frm.set_value('round_per_box', issueDetails[4]);
                            frm.set_value('ammunition_storage_id', issueDetails[5]);
                            frm.set_value('ammunition_storage_shelf', issueDetails[6]);
                        }
                    });
                },
                () => {
                    frm.set_value('ammunition_rfid', '');
                    frm.set_value('ammunition_category', '');
                    frm.set_value('box_number', '');
                    frm.set_value('rounds_issued', '');
                    frm.set_value('round_per_box', '');
                    frm.set_value('ammunition_storage_id', '');
                    frm.set_value('ammunition_storage_shelf', '');
                }
            );
        }
    }
});


// var isAmmunitionHandlerRunning = false;
// var isWeaponHandlerRunning = false;

// frappe.ui.form.on('Weapon and Ammunition Return', {
//     ammunition_rfid: function(frm) {

//         if (isWeaponHandlerRunning) {
//             return;
//         }

//         isAmmunitionHandlerRunning = true;

//         frm.set_value('issue_document_number','');
//         frm.set_value('unit_location','');
//         frm.set_value('issue_data_and_time','');
//         frm.set_value('duty_code','');
//         frm.set_value('duty_name','');
//         frm.set_value('duty_start', '');
//         frm.set_value('duty_end','');
//         frm.set_value('duty_location', '');
//         frm.set_value('personnel_rfid', '');
//         frm.set_value('personnel_id','');
//         frm.set_value('person_name','');
//         frm.set_value('rank','');
//         frm.set_value('weapon_rfid','');
//         frm.set_value('weapon_category','');
//         frm.set_value('weapon_name','');
//         frm.set_value('weapon_serial_number','');
//         frm.set_value('butt_number','');
//         frm.set_value('weapon_storage_id','');
//         frm.set_value('weapon_storage_shelf','');
//         frm.set_value('ammunition_category','');
//         frm.set_value('box_number', '');
//         frm.set_value('rounds_issued','');
//         frm.set_value('round_per_box','');
//         frm.set_value('ammunition_storage_id','');
//         frm.set_value('ammunition_storage_shelf','');
//         frm.set_value('return_date_and_time','');

//         var unitLocation;
//         if (frm.doc.ammunition_rfid) {
            
//             frappe.call({
//                 method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_issue_details_a',
//                 args: {
//                     ammunitionRFID: frm.doc.ammunition_rfid
//                 },
//                 callback: function(response) {
//                     var issueDetails = response.message;
//                         frm.set_value('issue_document_number',issueDetails[1])
//                         frm.set_value('issue_data_and_time', issueDetails[2]);
//                         frm.set_value('duty_code', issueDetails[3]);
//                         frm.set_value('duty_name', issueDetails[4]);
//                         frm.set_value('duty_start', issueDetails[5]);
//                         frm.set_value('duty_end', issueDetails[6]);
//                         frm.set_value('duty_location', issueDetails[7]);
//                         frm.set_value('personnel_rfid', issueDetails[8]);
//                         frm.set_value('personnel_id', issueDetails[9]);
//                         frm.set_value('person_name', issueDetails[10]);
//                         frm.set_value('rank', issueDetails[11]);
//                         frm.set_value('weapon_rfid', issueDetails[12]);
//                         frm.set_value('weapon_category', issueDetails[13]);
//                         frm.set_value('weapon_name', issueDetails[14]);
//                         frm.set_value('weapon_serial_number', issueDetails[15]);
//                         frm.set_value('butt_number', issueDetails[16]);
//                         frm.set_value('weapon_storage_id', issueDetails[17]);
//                         frm.set_value('weapon_storage_shelf', issueDetails[18]);    
//                         frm.set_value('ammunition_category', issueDetails[19]);
//                         frm.set_value('box_number', issueDetails[20]);
//                         frm.set_value('rounds_issued', issueDetails[21]);
//                         frm.set_value('round_per_box', issueDetails[22]);
//                         frm.set_value('ammunition_storage_id', issueDetails[23]);
//                         frm.set_value('ammunition_storage_shelf', issueDetails[24]);
//                         frm.set_value('return_date_and_time',frappe.datetime.now_datetime())
//                         unitLocation = issueDetails[0];
//                         frm.set_value('unit_location', unitLocation);

//                         resetAmmunitionHandlerFlag();
                        
//                         frappe.call({
//                             method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_authorizer',
//                             args: {
//                                 unitLocation: frm.doc.unit_location
//                             },
//                             callback: function (response) {
//                                 var options = response.message;
//                                 frm.set_query("authorized_by", function () {
//                                     return {
//                                         filters: [
//                                             ["Person Master", "name", "in", options]
//                                         ]
//                                     };
//                                 });
//                             }
//                         });
    
//                         frappe.call({
//                             method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_armourer',
//                             args: {
//                                 unitLocation: frm.doc.unit_location
//                             },
//                             callback: function (response) {
//                                 var options = response.message;
//                                 frm.set_query("armourer_id", function () {
//                                     return {
//                                         filters: [
//                                             ["Person Master", "name", "in", options]
//                                         ]
//                                     };
//                                 });
//                             }
//                         });
//                 }
//             });
//         } else {
            
//             resetAmmunitionHandlerFlag();
//         }
//     },
// });


// frappe.ui.form.on('Weapon and Ammunition Return', {
//     weapon_rfid: function(frm) {

//         if (isAmmunitionHandlerRunning) {
//             return;
//         }
//         isWeaponHandlerRunning = true;

//         frm.set_value('issue_document_number', '');
//         frm.set_value('unit_location', '');
//         frm.set_value('issue_data_and_time', '');
//         frm.set_value('duty_code', '');
//         frm.set_value('duty_name', '');
//         frm.set_value('duty_start', '');
//         frm.set_value('duty_end', '');
//         frm.set_value('duty_location', '');
//         frm.set_value('personnel_rfid', '');
//         frm.set_value('personnel_id', '');
//         frm.set_value('person_name', '');
//         frm.set_value('rank', '');
//         frm.set_value('weapon_category', '');
//         frm.set_value('weapon_name', '');
//         frm.set_value('weapon_serial_number', '');
//         frm.set_value('butt_number', '');
//         frm.set_value('weapon_storage_id', '');
//         frm.set_value('weapon_storage_shelf', '');
//         frm.set_value('ammunition_rfid', '');
//         frm.set_value('ammunition_category', '');
//         frm.set_value('box_number', '');
//         frm.set_value('rounds_issued', '');
//         frm.set_value('round_per_box', '');
//         frm.set_value('ammunition_storage_id', '');
//         frm.set_value('ammunition_storage_shelf', '');
//         frm.set_value('return_date_and_time', '');

//         var unitLocation;
//         if (frm.doc.weapon_rfid) {
//             frappe.call({
//                 method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_issue_details_w',
//                 args: {
//                     weaponRFID: frm.doc.weapon_rfid
//                 },
//                 callback: function(response) {
//                     var issueDetails = response.message;
//                     if (!issueDetails){
//                          frm.set_value(frm.doc.weapon_rfid,'')
//                          frappe.throw("Wrong RFID")
//                     }else if(issueDetails===1){
//                          frm.set_value(frm.doc.weapon_rfid,'')
//                          frappe.throw("Weapon Already Returned.")
//                     }else{
//                          frm.set_value('issue_document_number', issueDetails[1]);
//                          frm.set_value('issue_data_and_time', issueDetails[2]);
//                          frm.set_value('duty_code', issueDetails[3]);
//                          frm.set_value('duty_name', issueDetails[4]);
//                          frm.set_value('duty_start', issueDetails[5]);
//                          frm.set_value('duty_end', issueDetails[6]);
//                          frm.set_value('duty_location', issueDetails[7]);
//                          frm.set_value('personnel_rfid', issueDetails[8]);
//                          frm.set_value('personnel_id', issueDetails[9]);
//                          frm.set_value('person_name', issueDetails[10]);
//                          frm.set_value('rank', issueDetails[11]);
//                          frm.set_value('weapon_category', issueDetails[12]);
//                          frm.set_value('weapon_name', issueDetails[13]);
//                          frm.set_value('weapon_serial_number', issueDetails[14]);
//                          frm.set_value('butt_number', issueDetails[15]);
//                          frm.set_value('weapon_storage_id', issueDetails[16]);
//                          frm.set_value('weapon_storage_shelf', issueDetails[17]);
//                          frm.set_value('ammunition_rfid', issueDetails[18]);
//                          frm.set_value('ammunition_category', issueDetails[19]);
//                          frm.set_value('box_number', issueDetails[20]);
//                          frm.set_value('rounds_issued', issueDetails[21]);
//                          frm.set_value('round_per_box', issueDetails[22]);
//                          frm.set_value('ammunition_storage_id', issueDetails[23]);
//                          frm.set_value('ammunition_storage_shelf', issueDetails[24]);
//                          frm.set_value('return_date_and_time', frappe.datetime.now_datetime());
//                          unitLocation = issueDetails[0];
//                          frm.set_value('unit_location', unitLocation);
//                      }

//                     resetWeaponHandlerFlag();
                    
//                     frappe.call({
//                         method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_authorizer',
//                         args: {
//                             unitLocation: frm.doc.unit_location
//                         },
//                         callback: function (response) {
//                             var options = response.message;
//                             frm.set_query("authorized_by", function () {
//                                 return {
//                                     filters: [
//                                         ["Person Master", "name", "in", options]
//                                     ]
//                                 };
//                             });
//                         }
//                     });

//                     frappe.call({
//                         method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_armourer',
//                         args: {
//                             unitLocation: frm.doc.unit_location
//                         },
//                         callback: function (response) {
//                             var options = response.message;
//                             frm.set_query("armourer_id", function () {
//                                 return {
//                                     filters: [
//                                         ["Person Master", "name", "in", options]
//                                     ]
//                                 };
//                             });
//                         }
//                     });
//                 }
//             });
//         }else {
//             resetWeaponHandlerFlag();
//         }
//     }
// });


// function resetAmmunitionHandlerFlag() {
//     setTimeout(function () {
//         isAmmunitionHandlerRunning = false;
//     }, 0);
// }

// function resetWeaponHandlerFlag() {
//     setTimeout(function () {
//         isWeaponHandlerRunning = false;
//     }, 0);
// }


frappe.ui.form.on("Weapon and Ammunition Return", {
    rounds_returned: function (frm) {
        frm.set_value('rounds_used', '');
		frm.set_value('empty_case_returned', '');

        if (frm.doc.rounds_returned > frm.doc.rounds_issued || frm.doc.rounds_returned < 1) {
            frm.set_value('rounds_returned', ' ');
            frappe.throw("Enter Correct Quantity.");
        }

        if (frm.doc.rounds_returned) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.calculate_quantity_used',
                args: {
                    issuedQuantity: frm.doc.rounds_issued,
					roundsReturned: frm.doc.rounds_returned
                },
                callback: function (response) {
                    var quantityUsed = response.message;
                    frm.set_value('rounds_used', quantityUsed);
                }
            });
        }
    }
});


frappe.ui.form.on("Weapon and Ammunition Return", {
    empty_case_returned: function (frm) {
        frm.set_value('empty_case_balance', '');

        if (frm.doc.empty_case_returned > frm.doc.rounds_used || frm.doc.empty_case_returned < 1) {
            frm.set_value('empty_case_returned', ' ');
        }

        if (frm.doc.rounds_returned && frm.doc.empty_case_returned >= 1 && frm.doc.empty_case_returned <= frm.doc.rounds_used) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.calculate_empty_case_balance',
                args: {
                    quantityUsed: frm.doc.rounds_used,
                    emptyCaseReturned: frm.doc.empty_case_returned
                },
                callback: function (response) {
                    var emptyCaseBalanced = response.message;
                    frm.set_value('empty_case_balance', emptyCaseBalanced);
                }
            });
        }
    }
});




frappe.ui.form.on("Weapon and Ammunition Return",{
	refresh:function(frm){
		if(frm.doc.unit_location){
			frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_authorizer',
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
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_armourer',
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


frappe.ui.form.on("Weapon and Ammunition Return",{
	authorized_by:function(frm){
		if (!frm.doc.authorized_by){
			frm.set_value('authorizer_name','')
		}
		if (frm.doc.authorized_by){
			frappe.call({
				method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_person_name',
				args:{
					personID: frm.doc.authorized_by
				},
				callback: function(response){
					var authorizer_name = response.message
					frm.set_value("authorizer_name",authorizer_name)
				}
			})
		}
	}
})


frappe.ui.form.on("Weapon and Ammunition Return",{
	armourer_id:function(frm){
		if (!frm.doc.authorized_by){
			frm.set_value('armourer_name','')
		}
		if (frm.doc.authorized_by){
			frappe.call({
				method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_person_name',
				args:{
					personID: frm.doc.armourer_id
				},
				callback: function(response){
					var armourer_name = response.message
					frm.set_value("armourer_name",armourer_name)
				}
			})
		}
	}
})
