$(document).ready(function () {

    //Fields for saving state of category, type and administrators selectlist-filters
    let categoriesFilterCash = findAllCategoriesNames();
    let typesFilterCash = 'all';
    let adminsFilterCash = 'all';

    init();

    /**
     * Load data from server, build table of resource types
     */
    function init() {
        $.get(projectPathPrefix + "/api/getTypes", function (data) {
            buildTable(data);
            $('#types-table').show();
            $('#all-categories a').click();
            return data;
        }, "json");
    }

    /**
     * Build table of resource types
     * @param dataSource - JSON with resource types
     */
    function buildTable(dataSource) {
        //Initialization of DataTables plugin
        let typesTable = $('#types-table').DataTable({
            "dom": 'rt<"bottom"lp><"clear">',
            "language": {
                "zeroRecords": "Nothing found - sorry",
                "infoEmpty": "No records available",
            },
            "data": dataSource,
            "columns": [
                {"data": null},
                {"data": "categoryName"},
                {"data": "typeName"},
                {"data": "administratorName"},
                {"data": null},
                {"data": null},
                {"data": null},
                {"data": null},
                {"data": null},
            ],
            "columnDefs": [{
                "targets": [4, 5, 6, 7, 8],
                "searchable": false,
                "orderable": false,
                "render": function (data, type, row, meta) {
                    return buildActionButtons(row, meta.col);
                }
            },
                {
                    "targets": 0,
                    "searchable": false,
                    "orderable": false,
                }],
            "order": [[2, 'asc']]
        });

        //Automatic recalculation of numeration column on search and order events
        typesTable.on('order.dt search.dt', function () {
            typesTable.column(0, {search: 'applied', order: 'applied'}).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        //Implementation of custom table-filtering on change-events of categories selectlist-filter
        $('#categories').change(function (e) {
            $.fn.dataTable.ext.search.pop();
            let selectedCategoryName = $(e.target).data('selectedName');
            let categories = selectedCategoryName === 'all' ? findAllCategoriesNames()
                : findNestedCategoriesNames(selectedCategoryName);
            buildTypesSelect(categories, dataSource);
            $.fn.dataTable.ext.search.push(
                function (settings, searchData) {
                    let category = searchData[1];
                    let admin = searchData[3];
                    return categories.some(function (c) {
                        return c === category
                    }) && (adminsFilterCash === admin || adminsFilterCash === 'all');
                }
            );
            typesTable.draw();
            categoriesFilterCash = categories;
        });

        //Implementation of custom table-filtering on change-events of types selectlist-filter
        $('#types').change(function () {
            $.fn.dataTable.ext.search.pop();
            let selectedTypeName = $(this).val();
            $.fn.dataTable.ext.search.push(
                function (settings, searchData) {
                    let category = searchData[1];
                    let type = searchData[2];
                    let admin = searchData[3];
                    return categoriesFilterCash.some(function (c) {
                            return c === category
                        }) && (selectedTypeName === type || selectedTypeName === 'all')
                        && (adminsFilterCash === admin || adminsFilterCash === 'all');
                });
            typesTable.draw();
            typesFilterCash = selectedTypeName;
        });

        //Implementation of custom table-filtering on change-events of administrators selectlist-filter
        $('#admins').change(function () {
            $.fn.dataTable.ext.search.pop();
            let selectedAdminName = $(this).val();
            $.fn.dataTable.ext.search.push(
                function (settings, searchData) {
                    let category = searchData[1];
                    let type = searchData[2];
                    let admin = searchData[3];
                    return categoriesFilterCash.some(function (c) {
                            return c === category
                        }) && (typesFilterCash === type || typesFilterCash === 'all')
                        && (selectedAdminName === admin || selectedAdminName === 'all');
                });
            typesTable.draw();
            adminsFilterCash = selectedAdminName;
        });

        //Show confirmation modal window after clicking on button "Instantiate resource type"
        $.each($('.inst-button'), function (i, item) {
            $(item).click(function () {
                if (!$(this).hasClass('disabled')) {
                    $('#confirm-dialog').modal('show');
                    $('#confirm-dialog').data('action', 'instantiate');
                    $('#confirm-dialog').data('id', $(item).attr('data-id'));
                    $('#confirm-title').text('Confirm instantiation of resource type');
                    $('#confirm-body').text('Are you sure you want to instantiate resource type "'
                        + $(item).attr('data-type') + '"?');
                }
            })
        });

        //Show confirmation modal window after clicking on button "Remove resource type"
        $.each($('.remove-button'), function (i, item) {
            $(item).click(function () {
                if (!$(this).hasClass('disabled')) {
                    $('#confirm-dialog').modal('show');
                    $('#confirm-dialog').data('action', 'remove');
                    $('#confirm-dialog').data('id', $(item).attr('data-id'));
                    $('#confirm-title').text('Confirm removing of resource type');
                    $('#confirm-body').text('Are you sure you want to remove resource type "'
                        + $(item).attr('data-type') + '"?');
                }
            })
        });

        //Execution of instantiate or remove actions after clicking on confirmation-button
        $('#confirm-button').click(function () {
            let id = $('#confirm-dialog').data('id');
            if ($('#confirm-dialog').data('action') === 'instantiate') {
                instantiateType(id);
            } else if ($('#confirm-dialog').data('action') === 'remove') {
                removeType(id, typesTable);
            }
            $('#confirm-dialog').modal('hide');
        });

        //Event-listeners for buttons "Show resource type info"
        $.each($('.info-button'), function (i, item) {
            $(item).click(function () {
                let typeId = $(item).attr('data-id');
                showTypeInfo(typeId);
            })
        });
    }

    /**
     * Build action buttons in table for operations with resource types
     * @param rowData - part of JSON returned by DataTables plugin with information which places in current table row
     * @param col - number of column, returned by DataTables plugin
     * @returns {*} HTML-button which will be rendering in table
     */
    function buildActionButtons(rowData, col) {
        let restrictAccess = rowData.administratorName !== currentAdmin ? 'disabled"' : '"';
        let cloneLink = projectPathPrefix + '/resources/cloneType?typeId=' + rowData.typeId;
        let editLink = projectPathPrefix + '/resources/editType?typeId=' + rowData.typeId;
        let button;
        switch (col) {
            case 4:
                button = rowData.instantiated ? '' : '<button class="btn btn-primary btn-xs inst-button '
                    + restrictAccess + 'data-id=' + rowData.typeId + ' data-type=' + rowData.typeName
                    + ' title="Instantiate resource type">Instantiate</button>';
                break;
            case 5:
                button = '<a style="padding-top: 2px" target="_blank" href="' + cloneLink
                    + '" class="btn btn-link" data-id=' + rowData.typeId
                    + ' title="Clone resource type"><span class="glyphicon glyphicon-duplicate"</span></a>';
                break;
            case 6:
                button = rowData.instantiated ? '' : '<a style="padding-top: 2px" target="_blank" href="'
                    + editLink + '" class="btn btn-link edit-button ' + restrictAccess + 'data-id='
                    + rowData.typeId + ' title="Edit resource type"><span class="glyphicon glyphicon-pencil"</span></a>';
                break;
            case 7:
                button = rowData.instantiated ? '' : '<button style="padding-top: 2px" class="btn btn-link remove-button '
                    + restrictAccess + 'data-id=' + rowData.typeId + ' data-type=' + rowData.typeName
                    + ' title="Remove resource type"><span class="glyphicon glyphicon-remove"</span></button>';
                break;
            case 8:
                button = '<button style="padding-top: 2px"' + ' class="btn btn-link info-button" data-id=' + rowData.typeId
                    + ' title="View resource type"><span class="glyphicon glyphicon-info-sign"</span></button>';
                break;
        }
        return button;
    }

    /**
     * Returns array with names of selected resource category and all its descendant categories
     * @param categoryName - name of selected category
     * @returns {Array.<string>} array of names of resource categories
     */
    function findNestedCategoriesNames(categoryName) {
        let categoryItem = $("li[data-name='" + categoryName + "']");
        let nextCategoryItems = categoryItem.nextAll('.category-item');
        let level = categoryItem.attr('data-level');
        let nestedCategories = [categoryItem.attr('data-name')];
        $.each(nextCategoryItems, function (i, item) {
            if ($(item).attr('data-level') > level) {
                nestedCategories.push($(item).attr('data-name'));
            }
            return ( $(item).attr('data-level') != level );
        });
        return nestedCategories;
    }

    /**
     * Returns array with names of all resource categories
     * @returns {Array.<string>} array of names of resource categories
     */
    function findAllCategoriesNames() {
        let allCategories = $('.category-item');
        let allCategoriesList = [];
        $.each(allCategories, function (i, item) {
            allCategoriesList.push($(item).attr('data-name'));
        });
        return allCategoriesList;
    }

    /**
     * Fill items of resource types selectlist-filter depending on chosen resource category
     * @param categories - array with names of selected resource category and all its descendant categories
     * @param dataSource - JSON with resource types
     */
    function buildTypesSelect(categories, dataSource) {
        let typesItems = [];
        $('#types').html('');
        $.each(dataSource, function (i, item) {
            if (categories.some(function (c) {
                    return c === item['categoryName']
                })) {
                typesItems.push(item);
            }
        });
        if (typesItems.length > 0) {
            $('#types').html('<option value="all">All resource types</option>');
            $.each(typesItems, function (i, item) {
                $('<option/>', {
                    value: item['typeName'],
                    text: item['typeName'],
                }).appendTo($('#types'));
            });
        }
        $('#types').selectpicker('refresh');
        //Set option "All resource types" when selecting any option in categories selectlist-filter
        typesFilterCash = 'all';
    }

    /**
     * Execute operation of resource type instantiating
     * @param id - ID of the resource type
     */
    function instantiateType(id) {
        $.ajax({
            type: "PUT",
            url: projectPathPrefix + "/api/instantiateType/" + id,
            success: function (jqXHR) {
                $('button[data-id=' + id + ']').filter(function () {
                    return $(this).hasClass('inst-button') || $(this).hasClass('remove-button');
                }).remove();
                $('a.edit-button').filter(function () {
                    return $(this).attr('data-id') === id;
                }).remove();
            },
            error: function (jqXHR) {
                let error = JSON.parse(jqXHR.responseText);
                alert('Error!\n' + error.message);
            }
        });
    }

    /**
     * Execute operation of resource type removing
     * @param id - ID of the resource type
     * @param table - object of existent DataTable of resource types
     */
    function removeType(id, table) {
        $.ajax({
            type: "DELETE",
            url: projectPathPrefix + "/api/deleteType/" + id,
            success: function (jqXHR) {
                let row = $('button[data-id=' + id + ']').parents('tr');
                table
                    .row(row)
                    .remove()
                    .draw();
            },
            error: function (jqXHR) {
                let error = JSON.parse(jqXHR.responseText);
                alert('Error!\n' + error.message);
            }
        });
    }

    /**
     * Load data from server about particular resource type and show modal window with this information
     * @param id - ID of the resource type
     */
    function showTypeInfo(id) {
        $.get(projectPathPrefix + "/api/typeInfo/" + id, function (data) {
            data = JSON.parse(JSON.stringify(data)
                .replace(/},"searchable"/g, ',"searchable"')
                .replace(/{"property":/g, ''));
            $('#type-name').html('<span class="font-bold">Resource type name: </span>' +
                '<span>' + data.typeName + '</span>');
            $('#category-name').html('<span class="font-bold">Category of the resource type: </span>' +
                '<span>' + data.categoryName + '</span>');
            $('#is-instantiated > span').text(data.instantiated === true ? 'Instantiated' : 'Not instantiated');
            $('#props-tbody').empty();
            if (data.properties.length === 0) {
                $('#props-tbody').append('<tr><td class="text-center" colspan="8">' +
                    'Resource type hasn\'t properties yet</td></tr>');
            } else {
                data.properties = sortByProperty(data.properties, 'title', 'asc');
                let unitsShort;
                $.each(data.properties, function (i, item) {
                    $.each(item, function (j, subItem) {
                        if (subItem === null) {
                            item[j] = '';
                        } else if (subItem === true) {
                            item[j] = 'Yes';
                        } else if (subItem === false) {
                            item[j] = 'No';
                        }
                    });
                    unitsShort = item.unitsShort === '' ? '' : ' (' + item.unitsShort + ')';
                    $('#props-tbody').append('<tr>' +
                        '<td>' + (i + 1) + '</td>' +
                        '<td>' + item.title + '</td>' +
                        '<td>' + item.units + unitsShort + '</td>' +
                        '<td>' + item.pattern + '</td>' +
                        '<td>' + item.valueType + '</td>' +
                        '<td>' + item.searchable + '</td>' +
                        '<td>' + item.required + '</td>' +
                        '<td>' + item.unique + '</td>' +
                        '</tr>');
                });
            }
            $('#type-info-dialog').modal('show');
        }, "json");
    }
});