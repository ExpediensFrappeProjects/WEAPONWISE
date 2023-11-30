frappe.pages['weapon-in-form'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Weapon In Form',
        single_column: true
    });

    let unitLocation = page.add_field({
        label: "Unit Location",
        fieldtype: 'Select',
        fieldname: 'unit_location',
        options: []
    });

    let documentNumber = page.add_field({
        label: "Document Number",
        fieldtype: 'Data',
        fieldname: 'document_number'
    });

    let datarangeField = page.add_field({
        label: "Document Date",
        fieldtype: 'Date',
        fieldname: 'document_date'
    });

    let source = page.add_field({
        label: "Source",
        fieldtype: 'Data',
        fieldname: 'source'
    });

	let weaponName = page.add_field({
        label: "Weapon Category",
        fieldtype: 'Select',
        fieldname: 'weapon_name',
		options: []
    });

    let weaponCategory = page.add_field({
        label: "Weapon Category",
        fieldtype: 'Select',
        fieldname: 'weapon_category',
        options: []
    });

    let quantity = page.add_field({
        label: "Quantity",
        fieldtype: 'Int',
        fieldname: 'quantity'
    });

    let tableContainer = $('<div id="weaponTable"></div>').appendTo(page.main);
    var addFlag = false;

    let add = page.add_field({
        label: "ADD",
        fieldtype: 'Button',
        fieldname: 'add',
        click: function () {
            if (addFlag) {
                if (validateFields()) {
                    const quantityValue = quantity.get_value();

                    if (!tableContainer.find('table').length) {
                        // If table does not exist, create it
                        createModernTable(tableContainer, ['Weapon Category', 'Weapon Name', 'RFID Tag', 'Unit', 'Serial Number', 'Butt Number', 'Date Acquired', 'Storage ID', 'Shelf'], quantityValue, weaponCategory.get_value());
                    } else {
                        // If table exists, add rows to it
                        addRowsToTable(tableContainer, quantityValue, weaponCategory.get_value());
                    }

                    addFlag = false; // Reset the flag after processing
                } else {
                    frappe.msgprint(__('Please fill in all required fields.'));
                }
            }
        }
    });

    let clearFields = page.add_field({
        label: "Clear Fields",
        fieldtype: 'Button',
        fieldname: 'clear_fields',
        click: function () {
            weaponCategory.set_value('');
            quantity.set_value('');
            addFlag = true; // Set the flag when clearing fields
        }
    });

    function addRowsToTable(container, numRows, selectedWeaponCategory) {
        let table = container.find('table');
        let tbody = table.find('tbody');
        let startingSerialNumber = getLastSerialNumber() + 1;

        for (let i = 0; i < numRows; i++) {
            let currentSerialNumber = startingSerialNumber + i;

            let row = $('<tr></tr>').appendTo(tbody);

            // Add S.No value
            $('<td style="text-align: center;">' + currentSerialNumber + '</td>').appendTo(row);

            for (let j = 0; j < 9; j++) { // Adjust the number of columns as needed
                let inputField = $('<input type="text" class="form-control">');

                // Check if column is 'Weapon Category' and selectedWeaponCategory is provided
                if (j === 0 && selectedWeaponCategory) {
                    inputField.val(selectedWeaponCategory);
                }

                $('<td></td>').append(inputField).appendTo(row);
            }

            let clearButton = $('<button class="btn btn-danger">Clear</button>');
            clearButton.click(function() {
                clearRow(row);
            });

            $('<td></td>').append(clearButton).appendTo(row);
        }
    }

    function clearRow(row) {
        row.find('input[type="text"]').val('');
    }

    function validateFields() {
        return (
            unitLocation.get_value() &&
            documentNumber.get_value() &&
            datarangeField.get_value() &&
            source.get_value() &&
            weaponCategory.get_value() &&
            quantity.get_value()
        );
    }

    function getLastSerialNumber() {
        let table = tableContainer.find('table');
        let rows = table.find('tbody tr');

        if (rows.length === 0) {
            return 0;
        }

        let lastRow = rows.last();
        let lastSerialNumber = parseInt(lastRow.find('td:first').text(), 10);
        return isNaN(lastSerialNumber) ? 0 : lastSerialNumber;
    }

    // Fetch options for Unit Location
    frappe.call({
        method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_unit_location',
        callback: function(response) {
            var unitLocations = response.message;
            unitLocation.df.options = unitLocations;
            unitLocation.refresh();
        }
    });

    // Fetch options for Weapon Category
    frappe.call({
        method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_weapon_category',
        callback: function(response) {
            var weaponCategories = response.message;
            weaponCategory.df.options = weaponCategories;
            weaponCategory.refresh();
        }
    });
};

function createModernTable(container, columns, numRows, selectedWeaponCategory) {
    let table = $('<table class="table table-bordered table-striped"></table>').appendTo(container);
    table.css('margin-top', '14px');

    let thead = $('<thead class="thead-dark"></thead>').appendTo(table);
    let headerRow = $('<tr></tr>').appendTo(thead);
    $('<th style="text-align: center;">S.No</th>').appendTo(headerRow); // Add S.No column
    columns.forEach(function(column) {
        $('<th style="text-align: center;">' + column + '</th>').appendTo(headerRow);
    });

    let tbody = $('<tbody></tbody>').appendTo(table);
    for (let i = 0; i < numRows; i++) {
        let row = $('<tr></tr>').appendTo(tbody);

        // Add S.No value
        $('<td style="text-align: center;">' + (i + 1) + '</td>').appendTo(row);

        for (let j = 0; j < columns.length; j++) {
            let inputField = $('<input type="text" class="form-control">');

            // Check if column is 'Weapon Category' and selectedWeaponCategory is provided
            if (columns[j] === 'Weapon Category' && selectedWeaponCategory) {
                inputField.val(selectedWeaponCategory);
            }

            if (columns[j] === 'Weapon Category') {
                inputField.val(selectedWeaponCategory); // Set weapon category value
            }

            $('<td></td>').append(inputField).appendTo(row);
        }

        let clearButton = $('<button class="btn btn-danger">Clear</button>');
        clearButton.click(function() {
            clearRow(row);
        });

        $('<td></td>').append(clearButton).appendTo(row);
    }

    return table;
}



// function createModernTable(container, columns, numRows) {
// 	let table = $('<table class="table table-bordered table-striped"></table>').appendTo(container);
// 	table.css('margin-top', '14px');

// 	let thead = $('<thead class="thead-dark"></thead>').appendTo(table);
// 	let headerRow = $('<tr></tr>').appendTo(thead);
// 	$('<th style="text-align: center;">S.No</th>').appendTo(headerRow); // Add S.No column
// 	columns.forEach(function(column) {
// 		$('<th style="text-align: center;">' + column + '</th>').appendTo(headerRow);
// 	});

// 	let tbody = $('<tbody></tbody>').appendTo(table);
// 	for (let i = 0; i < numRows; i++) {
// 		let row = $('<tr></tr>').appendTo(tbody);

// 		// Add S.No value
// 		$('<td style="text-align: center;">' + (i + 1) + '</td>').appendTo(row);

// 		for (let j = 0; j < columns.length; j++) {
// 			let inputField = $('<input type="text" class="form-control">');
// 			$('<td></td>').append(inputField).appendTo(row);
// 		}

// 		let clearButton = $('<button class="btn btn-danger">Clear</button>');
// 		clearButton.click(function() {
// 			clearRow(row);
// 		});

// 		$('<td></td>').append(clearButton).appendTo(row);
// 	}

// 	return table;
// }



function clearRow(row) {
	row.find('input[type="text"]').val('');
}


// frappe.pages['weapon-in-form'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'Weapon In Form',
// 		single_column: true
// 	});

// 	let unitLocation = page.add_field({
// 		label: "Unit Location",
// 		fieldtype: 'Select',
// 		fieldname: 'unit_location',
// 		options: []
// 	});

// 	let documentNumber = page.add_field({
// 		label: "Document Number",
// 		fieldtype: 'Data',
// 		fieldname: 'document_number'
// 	});

// 	let datarangeField = page.add_field({
// 		label: "Document Date",
// 		fieldtype: 'Date',
// 		fieldname: 'document_date'
// 	});

// 	let source = page.add_field({
// 		label: "Source",
// 		fieldtype: 'Data',
// 		fieldname: 'source'
// 	});

// 	let weaponCategory = page.add_field({
// 		label: "Weapon Category",
// 		fieldtype: 'Select',
// 		fieldname: 'weapon Category',
// 		options: []
// 	});

// 	let quantity = page.add_field({
// 		label: "Quantity",
// 		fieldtype: 'Int',
// 		fieldname: 'quantity'
// 	});

// 	let tableCreated = false;

// 	let add = page.add_field({
// 		label: "ADD",
// 		fieldtype: 'Button',
// 		fieldname: 'add',
// 		click: function() {
// 			if (validateFields()) {
// 				if (!tableCreated) {
// 					var tableContainer = $('<div></div>').appendTo(page.main);
// 					createModernTable(tableContainer, ['Sr. No.', 'Weapon Category', 'Weapon Name','RFID Tag', 'Unit', 'Serial Number', 'Butt Number','Date Acquired','Storage ID','Shelf'], quantity.get_value(), weaponCategory.get_value());
// 					tableCreated = true; 
// 				} else {
// 					frappe.msgprint(__('Table has already been created.'));
// 				}
// 			} else {
// 				frappe.msgprint(__('Please fill in all required fields.'));
// 			}
// 		}
// 	});

// 	let clearButton = page.add_field({
// 		label: "Clear",
// 		fieldtype: 'Button',
// 		fieldname: 'clear',
// 		click: function() {
// 			clearFields();
// 		}
// 	});

// 	function clearFields() {
// 		weaponCategory.set_input('');
// 		quantity.set_input('');
// 	}

// 	function fetchUnitLocation() {
// 		frappe.call({
// 			method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_unit_location',
// 			callback: function(response) {
// 				var unitLocations = response.message;
// 				unitLocation.df.options = unitLocations;
// 				unitLocation.refresh();
// 			}
// 		});
// 	}
// 	fetchUnitLocation();

// 	function fetchWeaponCategory() {
// 		frappe.call({
// 			method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_weapon_category',
// 			callback: function(response) {
// 				var weaponCategories = response.message;
// 				weaponCategory.df.options = weaponCategories;
// 				weaponCategory.refresh();
// 			}
// 		});
// 	}
// 	fetchWeaponCategory();


// 	function validateFields() {
// 		return unitLocation.get_value() && documentNumber.get_value() &&
// 			datarangeField.get_value() && source.get_value() &&
// 			weaponCategory.get_value() && quantity.get_value();
// 	}

// 	function createModernTable(container, columns, numRows, selectedWeaponCategory) {
// 		let table = $('<table class="modern-table"></table>').appendTo(container);
// 		table.css('margin-top', '14px');
// 		let thead = $('<thead></thead>').appendTo(table);
// 		let headerRow = $('<tr></tr>').appendTo(thead);
// 		columns.forEach(function(column) {
// 			$('<th style="text-align: center;">' + column + '</th>').appendTo(headerRow);
// 		});
	
// 		let tbody = $('<tbody></tbody>').appendTo(table);
// 		for (let i = 0; i < numRows; i++) {
// 			let row = $('<tr></tr>').appendTo(tbody);
	
// 			for (let j = 0; j < columns.length; j++) {
// 				let inputField = $('<input type="text" class="form-control">');
				
// 				if (columns[j] === 'Sr. No.') {
// 					inputField.attr('readonly', true);
// 				}
	
// 				if (columns[j] === 'Weapon Category' && selectedWeaponCategory) {
// 					inputField.val(selectedWeaponCategory);
// 				}
// 				if (columns[j] === 'Sr. No.') {
// 					inputField.val(i + 1);
// 				}
// 				$('<td></td>').append(inputField).appendTo(row);
// 			}
// 		}
	
// 		return table;
// 	}
	

// 	function clearRow(row) {
// 		row.find('input[type="text"]').val('');
// 	}
// };