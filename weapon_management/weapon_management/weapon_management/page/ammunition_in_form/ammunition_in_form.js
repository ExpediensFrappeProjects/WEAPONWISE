frappe.pages['ammunition-in-form'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Ammunition In Form',
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

    let documentDate = page.add_field({
        label: "Document Date",
        fieldtype: 'Date',
        fieldname: 'document_date'
    });

    let authorisedBy = page.add_field({
        label: "Authorised By",
        fieldtype: 'Select',
        fieldname: 'authorised_by',
        options: []
    });

    let authorizerName = page.add_field({
        label: "Authorizer Name",
        fieldtype: 'Data',
        fieldname: 'authorizer_name',
        read_only: true
    });

    let source = page.add_field({
        label: "Source",
        fieldtype: 'Data',
        fieldname: 'source'
    });

    let acquiredDate = page.add_field({
        label: "Acquired Date",
        fieldtype: 'Date',
        fieldname: 'acquired_date'
    });


    let ammunitionCategory = page.add_field({
        label: "Ammunition Category",
        fieldtype: 'Select',
        fieldname: 'ammunition_category',
        options: []
    });

    let quantity = page.add_field({
        label: "Quantity",
        fieldtype: 'Int',
        fieldname: 'quantity'
    });

    let tableContainer = $('<div id="weaponTable"></div>').appendTo(page.main);

    let addFlag = true;

    let add = page.add_field({
        label: "ADD",
        fieldtype: 'Button',
        fieldname: 'add',
        click: function () {
            if (addFlag) {
                if (validateFields()) {
                    const quantityValue = quantity.get_value();
                    const selectedAmmunitionCategory = ammunitionCategory.get_value();
                    if (!tableContainer.find('table').length) {
                        let columnWidths = [12, 10, 25, 6, 12, 8, 12, 12]; 
                        createModernTable(tableContainer, ['Ammunition Category', 'RFID Tag','Ammunition Box ID','Total Rounds Per Box', 'Storage ID', 'Shelf'], quantityValue, selectedAmmunitionCategory, columnWidths);
                    } else {
                        addRowsToTable(tableContainer, quantityValue, selectedAmmunitionCategory);
                    }
                    addFlag = false;
                } else {
                    frappe.msgprint(__('Please Fill In All Required Fields.'));
                }
            }
        }
    });

    function validateFields() {
        return (
            unitLocation.get_value() &&
            documentNumber.get_value() &&
            documentDate.get_value() &&
            source.get_value() &&
            ammunitionCategory .get_value() &&
            quantity.get_value()
        );
    }

    let clearFields = page.add_field({
        label: "Clear Fields",
        fieldtype: 'Button',
        fieldname: 'clear_fields',
        click: function () {
            ammunitionCategory.set_value('');
            quantity.set_value('');
            acquiredDate.set_value('');
            addFlag = true;
        }
    });


    function saveDocument(docValues, detailsData) {
        var isConfirmed = window.confirm('Confirm to Save Document');
        if (!isConfirmed) {
            return;
        }
        frappe.call({
            method: 'weapon_management.weapon_management.page.ammunition_in_form.ammunition_in_form.save_ammunition_in_document',
            args: {
                doc_values: docValues,
                details_data: detailsData
            },
            callback: function (response) {
                if (response.message) {
                    frappe.msgprint(__('Document Saved Successfully.'));
                    disableSaveButton();
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                } else {
                    frappe.msgprint(__('Failed To Save Document.'));
                }
            }
        });
    }
    
    function disableSaveButton() {
        let saveButton = page.body.find('.btn-success');
        saveButton.prop('disabled', true);
    }


    function fetchUnitLocation() {
        frappe.call({
            method: 'weapon_management.weapon_management.page.ammunition_in_form.ammunition_in_form.get_unit_location',
            callback: function (response) {
                var unitLocations = response.message;
                unitLocation.df.options = unitLocations;
                unitLocation.refresh();
            }
        });
    }
    fetchUnitLocation();

    unitLocation.$input.on('change', function () {
        var selectedUnitLocation = unitLocation.get_value();
        
        if (selectedUnitLocation) {
            fetchAutorizedBy(selectedUnitLocation);
            fetchStorageID(selectedUnitLocation);
        }
    });
    

    function fetchAutorizedBy(selectedUnitLocation) {
        frappe.call({
            method: 'weapon_management.weapon_management.page.ammunition_in_form.ammunition_in_form.get_authorised_by',
            args:{
                unitLocation:selectedUnitLocation
            },
            callback: function (response) {
                var authorisedByOptions = response.message;
                authorisedBy.df.options = authorisedByOptions;
                authorisedBy.refresh();
            }
        });
    
        authorisedBy.$input.on('change', function () {
            var selectedAuthorisedBy = authorisedBy.get_value();
            fetchAuthorizerName(selectedAuthorisedBy);
        });
    }

    
    function fetchAuthorizerName(selectedAuthorisedBy) {
        frappe.call({
            method: 'weapon_management.weapon_management.page.ammunition_in_form.ammunition_in_form.get_authorizer_name',
            args: {
                authorizedBy: selectedAuthorisedBy
            },
            callback: function (response) {
                var authorizerNameValue = response.message;
                authorizerName.set_value(authorizerNameValue);
            }
        });
    }
    

    function fetchAmmunitionCategory() {
        frappe.call({
            method: 'weapon_management.weapon_management.page.ammunition_in_form.ammunition_in_form.get_ammunition_category',
            callback: function (response) {
                var ammunitionCategorys = response.message;
				ammunitionCategory.df.options = ammunitionCategorys;
				ammunitionCategory.refresh()  
            }
        });
    }

	fetchAmmunitionCategory();

    var storageIDS;

    function fetchStorageID(selectedUnitLocation) {
        frappe.call({
            method: 'weapon_management.weapon_management.page.ammunition_in_form.ammunition_in_form.get_storage_id',
            args: {
                unitLocation: selectedUnitLocation
            },
            callback: function (response) {
                storageIDS = response.message;
            }
        });
    }

    var shelfOptions;
    
    function fetchShelf(selectedStorageID, rowElement) {
        frappe.call({
            method: 'weapon_management.weapon_management.page.ammunition_in_form.ammunition_in_form.get_shelfs',
            args: {
                storageID: selectedStorageID
            },
            callback: function (response) {
                shelfOptions = response.message;
                setShelfOptions(rowElement, shelfOptions);
            }
        });
    }

    function addSelectToRow(rowElement, storageIDS) {
        const selectField = $('<select class="form-control" data-fieldname="shelf"></select>');
        $('<option value="">Select Shelf</option>').appendTo(selectField);
        for (let k = 0; k < storageIDS.length; k++) {
            $('<option value="' + storageIDS[k] + '">' + storageIDS[k] + '</option>').appendTo(selectField);
        }
        rowElement.find('td:nth-child(7)').html(selectField);
    }
    
    function setShelfOptions(rowElement, storageIDS) {
        addSelectToRow(rowElement, storageIDS);
    }


    function createModernTable(container, columns, numRows, selectedAmmunitionCategory, selectedWeaponName, columnWidths) {
        let table = $('<table class="table table-bordered table-striped"></table>').appendTo(container);
        table.css('margin-top', '14px');
    
        let thead = $('<thead class="thead-dark"></thead>').appendTo(table);
        let headerRow = $('<tr></tr>').appendTo(thead);
        $('<th style="text-align: center; width: 5%;">S.No</th>').appendTo(headerRow); 
    
        for (let j = 0; j < columns.length; j++) {
            let columnWidth = columnWidths && columnWidths[j] ? columnWidths[j] + '%' : ''; 
            $('<th style="text-align: center; width: ' + columnWidth + ';">' + columns[j] + '</th>').appendTo(headerRow);
        }
    
        let tbody = $('<tbody></tbody>').appendTo(table);
        addRowsToTable(container, numRows, selectedAmmunitionCategory, selectedWeaponName);
        return table;
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

        let saveButtonCreated = false;

        function addRowsToTable(container, numRows, selectedAmmunitionCategory, selectedWeaponName) {
            let table = container.find('table');
            let tbody = table.find('tbody');
            let startingSerialNumber = getLastSerialNumber() + 1;

            for (let i = 0; i < numRows; i++) {
                let currentSerialNumber = startingSerialNumber + i;

                let row = $('<tr></tr>').appendTo(tbody);

                $('<td style="text-align: center;">' + currentSerialNumber + '</td>').appendTo(row);

                for (let j = 0; j < 6; j++) {
                    let inputField;

                    if (j === 4) {
                        inputField = $('<select class="form-control"></select>');
                        $('<option value="">Select Storage ID</option>').appendTo(inputField);

                        for (let k = 0; k < storageIDS.length; k++) {
                            $('<option value="' + storageIDS[k] + '">' + storageIDS[k] + '</option>').appendTo(inputField);
                        }

                        inputField.on('change', function () {
                            const selectedStorageID = $(this).val();
                            fetchShelf(selectedStorageID, row);
                        });
                    } else if (j === 5) {
                        inputField = $('<select class="form-control"></select>');
                        $('<option value="">Select Shelf</option>').appendTo(inputField);
                  
                    } else {
                        inputField = $('<input type="text" class="form-control">');

                        if (j === 0 && selectedAmmunitionCategory) {
                            inputField.val(selectedAmmunitionCategory);
                            inputField.prop('readonly', true);
                        }

                    }

                    $('<td></td>').append(inputField).appendTo(row);
                }

                let clearButton = $('<button class="btn btn-danger">Clear</button>');
                clearButton.click(function () {
                    clearRow(row);
                });

                $('<td></td>').append(clearButton).appendTo(row);
            }

                if (!saveButtonCreated) {
                    let saveButton = $('<button>')
                        .addClass('btn btn-success')
                        .text('Save')
                        .on('click', function () {
                            if (validateTable()) {
                                const docValues = {
                                    unit_location: unitLocation.get_value(),
                                    document_number: documentNumber.get_value(),
                                    document_date: documentDate.get_value(),
                                    source: source.get_value(),
                                    ammunition_category: ammunitionCategory.get_value(),
                                    quantity: quantity.get_value(),
                                    authorised_by: authorisedBy.get_value(),
                                    authorizer_name: authorizerName.get_value(),
                                    docstatus: 1
                                };

                                const detailsTable = tableContainer.find('table');
                                const detailsData = [];

                                detailsTable.find('tbody tr').each(function () {
                                    const row = $(this);
                                    const rowData = {
                                        ammunition_category: row.find('td:nth-child(2) input').val(),
                                        rfid_tag: row.find('td:nth-child(3) input').val(),
                                        ammunition_box_id: row.find('td:nth-child(4) input').val(),
                                        total_rounds_per_box: row.find('td:nth-child(5) input').val(),
										available_rounds_per_box: row.find('td:nth-child(5) input').val(),
                                        storage_id: row.find('td:nth-child(6) select').val(),
                                        shelf: row.find('td:nth-child(7) select').val(),
                                        date_acquired: acquiredDate.get_value(),
                                        status: 'Available',
                                        unit_location: unitLocation.get_value(),
                                        total_empty_cases_returned: 0,
                                        total_empty_cases_lost:0

                                    };
                                    detailsData.push(rowData);
                                });

                                saveDocument(docValues, detailsData);
                            } else {
                                frappe.msgprint(__('Please Fill In All Required Fields In The Table.'));
                            }
                        });

                    page.body.append(saveButton);
                    saveButtonCreated = true;
                }
            }

            function validateTable() {
                let isValid = true;

                const detailsTable = tableContainer.find('table');
                detailsTable.find('tbody tr').each(function () {
                    const row = $(this);
                    row.find('input, select').each(function () {
                        const value = $(this).val();
                        if (!value) {
                            isValid = false;
                            return false; 
                        }
                    });

                    if (!isValid) {
                        return false; 
                    }
                });

                return isValid;
            }

            function clearRow(row) {
                row.find('input[type="text"]').not('[readonly]').val('');
                row.find('select.form-control').val('').trigger('change');
            }

}