// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt

frappe.ui.form.on('Weapon and Ammunition Return', {
    weapon_rfid: function(frm) {
		frm.set_value('issue_document_number','')
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
		frm.set_value('weapon_category','');
		frm.set_value('weapon_name','');
		frm.set_value('weapon_serial_number','');
		frm.set_value('butt_number','');
		frm.set_value('weapon_storage_id','');
		frm.set_value('weapon_storage_shelf','');
		frm.set_value('ammunition_rfid','');
		frm.set_value('ammunition_category','');
		frm.set_value('box_number', '');
		frm.set_value('available_quantity','');
		frm.set_value('round_per_box','');
		frm.set_value('ammunition_storage_id','');
		frm.set_value('ammunition_storage_shelf','');

		frm.set_value('return_date_and_time','')
        var unitLocation;
        if (frm.doc.weapon_rfid) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_issue_details_w',
                args: {
                    weaponRFID: frm.doc.weapon_rfid
                },
                callback: function(response) {
                    var issueDetails = response.message;
					console.log(`${issueDetails}`)
					// frm.set_value('unit_location', issueDetails[0]);
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
					frm.set_value('weapon_category', issueDetails[11]);
					frm.set_value('weapon_name', issueDetails[12]);
					frm.set_value('weapon_serial_number', issueDetails[13]);
					frm.set_value('butt_number', issueDetails[14]);
					frm.set_value('weapon_storage_id', issueDetails[15]);
					frm.set_value('weapon_storage_shelf', issueDetails[16]);
					frm.set_value('ammunition_rfid', issueDetails[17]);
					frm.set_value('ammunition_category', issueDetails[18]);
					frm.set_value('box_number', issueDetails[19]);
					frm.set_value('available_quantity', issueDetails[20]);
					frm.set_value('round_per_box', issueDetails[21]);
					frm.set_value('ammunition_storage_id', issueDetails[22]);
					frm.set_value('ammunition_storage_shelf', issueDetails[23]);

					frm.set_value('return_date_and_time',frappe.datetime.now_datetime())

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
            });
        }
    }
});


// frappe.ui.form.on('Weapon and Ammunition Return', {
//     ammunition_rfid: function(frm) {
// 		frm.set_value('issue_document_number','')
// 		frm.set_value('unit_location','');
// 		frm.set_value('issue_data_and_time','');
// 		frm.set_value('duty_code','');
// 		frm.set_value('duty_name','');
// 		frm.set_value('duty_start', '');
// 		frm.set_value('duty_end','');
// 		frm.set_value('duty_location', '');
// 		frm.set_value('personnel_id','');
// 		frm.set_value('person_name','');
// 		frm.set_value('rank','');
// 		frm.set_value('weapon_rfid','')
// 		frm.set_value('weapon_category','');
// 		frm.set_value('weapon_name','');
// 		frm.set_value('weapon_serial_number','');
// 		frm.set_value('butt_number','');
// 		frm.set_value('weapon_storage_id','');
// 		frm.set_value('weapon_storage_shelf','');
// 		frm.set_value('ammunition_category','');
// 		frm.set_value('box_number', '');
// 		frm.set_value('available_quantity','');
// 		frm.set_value('round_per_box','');
// 		frm.set_value('ammunition_storage_id','');
// 		frm.set_value('ammunition_storage_shelf','');

// 		frm.set_value('return_date_and_time','')
//         var unitLocation;
//         if (frm.doc.ammunition_rfid) {
//             frappe.call({
//                 method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_issue_details_a',
//                 args: {
//                     ammunitionRFID: frm.doc.ammunition_rfid
//                 },
//                 callback: function(response) {
//                     var issueDetails = response.message;
// 					console.log(`${issueDetails}`)
// 					// frm.set_value('unit_location', issueDetails[0]);
// 					frm.set_value('issue_document_number',issueDetails[1])
// 					frm.set_value('issue_data_and_time', issueDetails[2]);
// 					frm.set_value('duty_code', issueDetails[3]);
// 					frm.set_value('duty_name', issueDetails[4]);
// 					frm.set_value('duty_start', issueDetails[5]);
// 					frm.set_value('duty_end', issueDetails[6]);
// 					frm.set_value('duty_location', issueDetails[7]);
// 					frm.set_value('personnel_id', issueDetails[8]);
// 					frm.set_value('person_name', issueDetails[9]);
// 					frm.set_value('rank', issueDetails[10]);
// 					frm.set_value('weapon_rfid',issueDetails[11])
// 					frm.set_value('weapon_category', issueDetails[12]);
// 					frm.set_value('weapon_name', issueDetails[13]);
// 					frm.set_value('weapon_serial_number', issueDetails[14]);
// 					frm.set_value('butt_number', issueDetails[15]);
// 					frm.set_value('weapon_storage_id', issueDetails[16]);
// 					frm.set_value('weapon_storage_shelf', issueDetails[17]);
// 					// frm.set_value('ammunition_rfid', issueDetails[17]);
// 					frm.set_value('ammunition_category', issueDetails[18]);
// 					frm.set_value('box_number', issueDetails[19]);
// 					frm.set_value('available_quantity', issueDetails[20]);
// 					frm.set_value('round_per_box', issueDetails[21]);
// 					frm.set_value('ammunition_storage_id', issueDetails[22]);
// 					frm.set_value('ammunition_storage_shelf', issueDetails[23]);

// 					frm.set_value('return_date_and_time',frappe.datetime.now_datetime())

// 					unitLocation = issueDetails[0];
//                     frm.set_value('unit_location', unitLocation);

// 					frappe.call({
// 						method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_authorizer',
// 						args: {
// 							unitLocation: frm.doc.unit_location
// 						},
// 						callback: function (response) {
// 							var options = response.message;
// 							frm.set_query("authorized_by", function () {
// 								return {
// 									filters: [
// 										["Person Master", "name", "in", options]
// 									]
// 								};
// 							});
// 						}
// 					});
		
// 					frappe.call({
// 						method: 'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.get_armourer',
// 						args: {
// 							unitLocation: frm.doc.unit_location
// 						},
// 						callback: function (response) {
// 							var options = response.message;
// 							frm.set_query("armourer_id", function () {
// 								return {
// 									filters: [
// 										["Person Master", "name", "in", options]
// 									]
// 								};
// 							});
// 						}
// 					});
//                 }
//             });
//         }
//     }
// });

frappe.ui.form.on("Weapon and Ammunition Return",{
	returned:function(frm){
		frm.set_value('quantity_used','')
		if (frm.doc.returned){
			frappe.call({
				method:'weapon_management.weapon_management.doctype.weapon_and_ammunition_return.weapon_and_ammunition_return.calculate_quantity_used',
				args:{
					returned: frm.doc.returned,
					available_quantity:frm.doc.available_quantity
				},
				callback: function(response){
					var quantityUsed = response.message
					frm.set_value('quantity_used',quantityUsed)
				}
			})
		}
	}

})


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