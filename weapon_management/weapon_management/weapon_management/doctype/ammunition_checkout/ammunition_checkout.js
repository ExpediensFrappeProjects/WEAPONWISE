// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ammunition CheckOut',{
	issue_document_number:function(frm){
		frm.set_value('unit_location','')
		frm.set_value('duty_code','');
		frm.set_value('duty_name','');
		frm.set_value('duty_start','');
		frm.set_value('duty_end','');
		frm.set_value('duty_location','');
		frm.set_value('personnel_id','');
		frm.set_value('person_name','');
		frm.set_value('rank','');
		frm.set_value('ammunition_rfid','');
		frm.set_value('ammunition_category','');
		frm.set_value('box_number','');
		frm.set_value('quantity','');
		frm.set_value('available_quantity','');
		frm.set_value('round_per_box','');
		frm.set_value('storage_id','');
		frm.set_value('storage_shelf','');
		if(frm.doc.issue_document_number){
			frappe.call({
				method: 'weapon_management.weapon_management.doctype.ammunition_checkout.ammunition_checkout.get_ammunition_details',
				args:{
					issueDocumentNumber:frm.doc.issue_document_number
				},
				callback:function(response){
					var ammunitionDetails = response.message;
					console.log(`${ammunitionDetails}`)
					frm.set_value('unit_location',ammunitionDetails[0])
					frm.set_value('duty_code',ammunitionDetails[1]);
					frm.set_value('duty_name',ammunitionDetails[2]);
					frm.set_value('duty_start',ammunitionDetails[3]);
					frm.set_value('duty_end',ammunitionDetails[4]);
					frm.set_value('duty_location',ammunitionDetails[5]);
					frm.set_value('personnel_id',ammunitionDetails[6]);
					frm.set_value('person_name',ammunitionDetails[7]);
					frm.set_value('rank',ammunitionDetails[8]);
					frm.set_value('ammunition_rfid',ammunitionDetails[9]);
					frm.set_value('ammunition_category',ammunitionDetails[10]);
					frm.set_value('box_number',ammunitionDetails[11]);
					frm.set_value('quantity',ammunitionDetails[12]);
					frm.set_value('available_quantity',ammunitionDetails[13]);
					frm.set_value('round_per_box',ammunitionDetails[14]);
					frm.set_value('storage_id',ammunitionDetails[15]);
					frm.set_value('storage_shelf',ammunitionDetails[16]);

				}

			})
		}
	}
})

frappe.ui.form.on('Ammunition CheckOut', {
	unit_location:function(frm){
		frm.set_value('date_and_time','')
		frm.set_value('authorised_by','')
		frm.set_value('armourer_id','')
		if(frm.doc.unit_location){
			frm.set_value('date_and_time',frappe.datetime.now_datetime())
		}
		frappe.call({
			method: 'weapon_management.weapon_management.doctype.ammunition_checkout.ammunition_checkout.get_authorizer',
			args: {
				unitLocation: frm.doc.unit_location
			},
			callback: function (response) {
				var options = response.message;
				console.log(`${options}`)
				frm.set_query("authorised_by", function () {
					return {
						filters: [
							["Person Master", "name", "in", options]
						]
					};
				});
			}
		});

		frappe.call({
			method: 'weapon_management.weapon_management.doctype.ammunition_checkout.ammunition_checkout.get_armourer',
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

frappe.ui.form.on('Ammunition CheckOut',{
	refresh:function(frm){
		if(frm.doc.unit_location){
			frappe.call({
				method: 'weapon_management.weapon_management.doctype.ammunition_checkout.ammunition_checkout.get_authorizer',
				args: {
					unitLocation: frm.doc.unit_location
				},
				callback: function (response) {
					var options = response.message;
					console.log(`${options}`)
					frm.set_query("authorised_by", function () {
						return {
							filters: [
								["Person Master", "name", "in", options]
							]
						};
					});
				}
			});

			frappe.call({
				method: 'weapon_management.weapon_management.doctype.ammunition_checkout.ammunition_checkout.get_armourer',
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


frappe.ui.form.on('Ammunition CheckOut',{
    authorised_by: function(frm){
		frm.set_value('authorizer_name','')
        frappe.call({
            method:'weapon_management.weapon_management.doctype.ammunition_checkout.ammunition_checkout.get_person_name',
            args: {
                personID : frm.doc.authorised_by
            },
            callback: function(response){
                var authorizerName = response.message;
                frm.set_value('authorizer_name',authorizerName)
            }
        })
    }
})

frappe.ui.form.on('Ammunition CheckOut',{
    armourer_id: function(frm){
		frm.set_value('armourer_name','')
        frappe.call({
            method:'weapon_management.weapon_management.doctype.ammunition_checkout.ammunition_checkout.get_person_name',
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