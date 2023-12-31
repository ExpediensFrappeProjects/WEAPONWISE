frappe.pages['weapon-in-form'].on_page_load = function (wrapper) {
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
        label: "Weapon Name",
        fieldtype: 'Select',
        fieldname: 'weapon_name',
        options: []
    });

    let weaponCategory = page.add_field({
        label: "Weapon Category",
        fieldtype: 'Data',
        fieldname: 'weapon_category',
        read_only: true
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
                    const selectedWeaponName = weaponName.get_value();
                    const selectedWeaponCategory = weaponCategory.get_value();

                    if (!tableContainer.find('table').length) {
                        createModernTable(tableContainer, ['Weapon Category', 'Weapon Name', 'RFID Tag', 'Unit', 'Serial Number', 'Butt Number', 'Storage ID', 'Shelf'], quantityValue, selectedWeaponCategory, selectedWeaponName);
                    } else {
                        // Call addRowsToTable when adding rows to an existing table
                        addRowsToTable(tableContainer, quantityValue, selectedWeaponCategory, selectedWeaponName);
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
            datarangeField.get_value() &&
            source.get_value() &&
            weaponCategory.get_value() &&
            quantity.get_value()
        );
    }

    let clearFields = page.add_field({
        label: "Clear Fields",
        fieldtype: 'Button',
        fieldname: 'clear_fields',
        click: function () {
            weaponName.set_value('');
            weaponCategory.set_value('');
            quantity.set_value('');
            addFlag = true;
        }
    });

    function fetchUnitLocation() {
        frappe.call({
            method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_unit_location',
            callback: function (response) {
                var unitLocations = response.message;
                unitLocation.df.options = unitLocations;
                unitLocation.refresh();
            }
        });
    }

    fetchUnitLocation();

    function fetchWeaponName() {
        frappe.call({
            method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_weapon_name',
            callback: function (response) {
                var weaponNames = response.message;
                weaponName.df.options = weaponNames;
                weaponName.refresh();
            }
        });

        weaponName.$input.on('change', function () {
            var selectedWeaponName = weaponName.get_value();
            fetchWeaponCategory(selectedWeaponName);
        });
    }

    fetchWeaponName();

    function fetchWeaponCategory(selectedWeaponName) {
        frappe.call({
            method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_weapon_category',
            args: {
                weaponName: selectedWeaponName
            },
            callback: function (response) {
                var weaponCategories = response.message;
                weaponCategory.set_value(weaponCategories);
            }
        });
    }

    unitLocation.$input.on('change', function () {
        var selectedUnitLocation = unitLocation.get_value();
        fetchStorageID(selectedUnitLocation);
    });

    var storageIDS;

    function fetchStorageID(selectedUnitLocation) {
        frappe.call({
            method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_storage_id',
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
            method: 'weapon_management.weapon_management.page.weapon_in_form.weapon_in_form.get_shelfs',
            args: {
                storageID: selectedStorageID
            },
            callback: function (response) {
                shelfOptions = response.message;
                console.log(`${shelfOptions}`);
                setShelfOptions(rowElement, shelfOptions);
            }
        });
    }

    function addSelectToRow(rowElement, storageIDS) {
        const selectField = $('<select class="form-control" data-fieldname="shelf"></select>');
    
        // Add options to the select field...
        $('<option value="">Select Shelf</option>').appendTo(selectField);
        for (let k = 0; k < storageIDS.length; k++) {
            $('<option value="' + storageIDS[k] + '">' + storageIDS[k] + '</option>').appendTo(selectField);
        }
    
        // Add the select field to the row
        rowElement.find('td:nth-child(9)').html(selectField);
    
        
    }
    
    // Function to set shelf options and bind the change event
    function setShelfOptions(rowElement, storageIDS) {
        addSelectToRow(rowElement, storageIDS);
    }

    function createModernTable(container, columns, numRows, selectedWeaponCategory, selectedWeaponName) { 
        let table = $('<table class="table table-bordered table-striped"></table>').appendTo(container);
        table.css('margin-top', '14px');
    
        let thead = $('<thead class="thead-dark"></thead>').appendTo(table);
        let headerRow = $('<tr></tr>').appendTo(thead);
        $('<th style="text-align: center;">S.No</th>').appendTo(headerRow);
    
        for (let j = 0; j < columns.length; j++) {
            $('<th style="text-align: center;">' + columns[j] + '</th>').appendTo(headerRow);
        }
    
        let tbody = $('<tbody></tbody>').appendTo(table);
        addRowsToTable(container, numRows, selectedWeaponCategory, selectedWeaponName);

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

    function addRowsToTable(container, numRows, selectedWeaponCategory, selectedWeaponName) {
        let table = container.find('table');
        let tbody = table.find('tbody');
        let startingSerialNumber = getLastSerialNumber() + 1;
    
        for (let i = 0; i < numRows; i++) {
            let currentSerialNumber = startingSerialNumber + i;
    
            let row = $('<tr></tr>').appendTo(tbody);
    
            $('<td style="text-align: center;">' + currentSerialNumber + '</td>').appendTo(row);
    
            for (let j = 0; j < 8; j++) {
                let inputField;
    
                if (j === 6) {
                    inputField = $('<select class="form-control"></select>');
                    $('<option value="">Select Storage ID</option>').appendTo(inputField);
                    
                    for (let k = 0; k < storageIDS.length; k++) {
                        $('<option value="' + storageIDS[k] + '">' + storageIDS[k] + '</option>').appendTo(inputField);
                    }
                    
                    inputField.on('change', function () {
                        const selectedStorageID = $(this).val();
                        fetchShelf(selectedStorageID, row);  // Pass the row element to fetchShelf
                    });
                }
                 else if (j === 7) {
                    inputField = $('<select class="form-control"></select>');
                    $('<option value="">Select Shelf</option>').appendTo(inputField);
                } else {
                    inputField = $('<input type="text" class="form-control">');
    
                    if (j === 0 && selectedWeaponCategory) {
                        inputField.val(selectedWeaponCategory);
                        inputField.prop('readonly', true);
                    }
    
                    if (j === 1 && selectedWeaponName) {
                        inputField.val(selectedWeaponName);
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
    }

    function clearRow(row) {
        row.find('input[type="text"]').not('[readonly]').val('');
        row.find('select.form-control').val('').trigger('change');
    }

};

