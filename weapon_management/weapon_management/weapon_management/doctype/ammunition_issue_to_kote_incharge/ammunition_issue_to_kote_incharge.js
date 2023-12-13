// Copyright (c) 2023, Expedien and contributors
// For license information, please see license.txt


frappe.ui.form.on('Ammunition Issue To KOTE InCharge', {
    personnel_rfid: function(frm) {
        frm.set_value('personnel_id', '');
        frm.set_value('person_name', '');
        frm.set_value('rank', '');
        frm.set_value('unit_location', '');
        frm.set_value('issued_date', '');
        frm.set_value('ammunition_rfid', '');
        if (frm.doc.personnel_rfid) {
            frappe.call({
                method: 'weapon_management.weapon_management.doctype.ammunition_issue_to_kote_incharge.ammunition_issue_to_kote_incharge.get_personnels_details',
                args: {
                    personnelRFID: frm.doc.personnel_rfid
                },
                callback: function(response) {
                    var personnelDetails = response.message;
					if (personnelDetails===1){
						frm.set_value('personnel_rfid','')
						frappe.throw('Wrong Personnel RFID or Selected Personnel Not An Armourer.')
					} else {
						frm.set_value('personnel_id', personnelDetails[0]);
						frm.set_value('person_name', personnelDetails[1]);
						frm.set_value('rank', personnelDetails[2]);
						frm.set_value('unit_location', personnelDetails[3]);
						frm.set_value('issued_date', frappe.datetime.now_datetime());
					}
                }
            });
        }
    }
});


frappe.ui.form.on('Ammunition Issue To KOTE InCharge',{
	ammunition_rfid:function(frm){
		frm.set_value('ammunition_category', '');
		frm.set_value('ammunition_box_id', '');
		frm.set_value('date_acquired', '');
		frm.set_value('total_rounds_per_box', ''); 
		frm.set_value('available_rounds_per_box', '');
		frm.set_value('manufacturing_date', '');
		frm.set_value('manufacturer', '');
		frm.set_value('total_empty_cases_returned', '');
		frm.set_value('total_empty_cases_lost', '');
		frm.set_value('storage_id', '');
		frm.set_value('shelf', '');
		if(frm.doc.ammunition_rfid){
			frappe.call({
				method: 'weapon_management.weapon_management.doctype.ammunition_issue_to_kote_incharge.ammunition_issue_to_kote_incharge.get_ammunition_details',
				args:{
					ammunitionRFID:frm.doc.ammunition_rfid
				},
				callback:function(response){
					var ammunitionDetails = response.message
					if (ammunitionDetails===1){
						frm.set_value('ammunition_rfid','')
						frappe.throw('Wrong Personnel RFID.')
					} else {
						frm.set_value('ammunition_category', ammunitionDetails[0]);
						frm.set_value('ammunition_box_id', ammunitionDetails[1]);
						frm.set_value('date_acquired', ammunitionDetails[2]);
						frm.set_value('total_rounds_per_box', ammunitionDetails[3]); 
						frm.set_value('available_rounds_per_box', ammunitionDetails[4]);
						frm.set_value('manufacturer', ammunitionDetails[5]);
						frm.set_value('manufacturing_date', ammunitionDetails[6]);
						frm.set_value('total_empty_cases_returned', ammunitionDetails[7]);
						frm.set_value('total_empty_cases_lost', ammunitionDetails[8]);
						frm.set_value('storage_id', ammunitionDetails[9]);
						frm.set_value('shelf', ammunitionDetails[10]);
					}

				}
			})
		
		}
	}
	
})