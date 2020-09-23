(function () {
    'use strict';

    angular
        .module('template-form-module', ['ngMaterial'])
        .filter('variabelname', function () {
            return function (input) {
                if (input) {
                    var string = input.replace(/\s+/g, '_'); // Replace space with '_'
                    string = string.replace(/-+/g, '_'); // Replace '-' with '_'
                    string = string.toLowerCase(); // Set all character to lowerCase
                    return string;
                }
            };
        })
        .factory('TemplateFormFactory', TemplateFormFactory);

    function TemplateFormFactory($http, EnvironmentConfig, $state, $log, AppFactory) {
        return {
            getPagedTemplateForm: getPagedTemplateForm,
            getTemplateForm: getTemplateForm,
            deleteTemplateForm: deleteTemplateForm,
            deleteCanvas: deleteCanvas,
            deleteCanvasTab: deleteCanvasTab,
            copyTemplateForm: copyTemplateForm,
            cancelAction: cancelAction,
            querySearchDataKolom: querySearchDataKolom,
            querySearchDatatabel: querySearchDatatabel,
            getDatatabelData: getDatatabelData,
            getWebServicelist: getWebServiceList,
            getCombogridConfig: getCombogridConfig,
            getNumberingList: getNumberingList,
            getButtonActionList: getButtonActionList,
            getOtomatisUpdateList: getOtomatisUpdateList,
            getTargetSimpanList: getTargetSimpanList
        };

        function getPagedTemplateForm(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'form?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getTemplateForm(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'form/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function (err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.template-form');
                });
        }

        function deleteTemplateForm(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'form/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function deleteCanvas(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'form/deletecanvas/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function deleteCanvasTab(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'form/deletecanvastab/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function copyTemplateForm(id) {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'form/copy/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.template-form');
        }


        function querySearchDatatabel(query) {
            return getDatabelListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getDatabelListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'datatabel/getlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getDatatabelData(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'datatabel/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getWebServiceList() {
            var query = '';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'KelompokData/getWebServicelist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getCombogridConfig(kelompokDataId) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'KelompokData/getCombogridConfig/' + kelompokDataId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getNumberingList() {
            var query = '';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'Penomoran/getlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getButtonActionList(type) {
            var query = '';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'Form/getButtonActionList?q=' + query + '&type=' + type,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getOtomatisUpdateList() {
            return [{
                'kode': 0,
                'label': 'Tidak'
            },
            {
                'kode': 1,
                'label': 'Ya'
            }];
        }

        function getTargetSimpanList() {
            return [{
                'kode': 'internal',
                'label': 'Internal'
            },
            {
                'kode': 'eksternal',
                'label': 'Eksternal'
            }];
        }

        function querySearchDataKolom(query, datatabel_id, dataKolomId) {
            return getDataKolomListService(query, datatabel_id, dataKolomId).then(function (res) {
                return res.data.data.items;
            });
        }

        function getDataKolomListService(params, id, dataKolomId) {
            var query = {
                datatabel_id: id,
                search:params
            };
            
            if (angular.isDefined(dataKolomId)) {
                query.dataKolomId = dataKolomId;
            } else {
                query.dataKolomId = null;
            }

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'datatabel/datakolom?q=' + query.search + '&datatabel_id=' + query.datatabel_id + '&datakolom_id=' + query.dataKolomId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                });
        }
    }

})();

/**
 * Dialog for configuring Canvas
 * @param $scope
 * @param $mdDialog
 * @param TemplateFormFactory
 * @param $log
 */
function canvasDialog($scope, $mdDialog, $log, TemplateFormFactory) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Canvas',
        datatabel: 'canvas',
        fields: [{
            id: null,
            del: false,
            field: [
                {
                    label: 'Tab Index',
                    type: 'number',
                    required: true,
                    data: ''
                },
                {
                    label: 'Tipe',
                    type: 'select',
                    options: [
                        {
                            id: 'form',
                            name: 'Form'
                        },
                        {
                            id: 'tabel',
                            name: 'Tabel'
                        },
                        {
                            id: 'tabel-grid',
                            name: 'Tabel Grid'
                        },
                        {
                            id: 'tabel-statik',
                            name: 'Tabel Statik'
                        },
                        {
                            id: 'maps',
                            name: 'Maps'
                        }
                    ],
                    /**Tipe Canvas**/
                    required: true,
                    data: ''
                },
                {
                    label: 'Nama',
                    type: 'text',
                    required: false,
                    data: ''
                },
                {
                    label: 'Web Service Awal',
                    type: 'text',
                    required: false,
                    data: ''
                },
                {
                    label: 'Data Tabel',
                    type: 'autocomplete-datatabel',
                    required: true,
                    data: ''
                },
                {
                    label: 'No Urut',
                    type: 'number',
                    data: '',
                    required: true
                }
            ]
        }]
    }];

    /*** BEGIN - Autocomplete for Datatabel ***/
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.querySearch = TemplateFormFactory.querySearchDatatabel;
    $scope.isDisabled = false;
    $scope.noCache = false;
    $scope.selectedItemChange = selectedItemChangeDatabel;

    //////////////////
    function selectedItemChangeDatabel(item) {
        if (angular.isDefined(item)) {
            $scope.forms[0].fields[0].field[4].data = item.id;
        } else {
            $scope.forms[0].fields[0].field[4].data = null;
        }
        $log.info($scope.forms[0].fields[0].field[4]);
    }
    /*** END - Autocomplete for Datatabel ***/
}

/**
 * Dialog for editing configuration of canvas
 * @param $scope
 * @param $mdDialog
 * @param TemplateFormFactory
 * @param $log
 * @param canvasData
 */
function editCanvasDialog($scope, $mdDialog, $log, TemplateFormFactory, canvasData) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Canvas',
        datatabel: 'canvas',
        fields: [{
            id: null,
            del: false,
            field: [
                {
                    label: 'Tab Index',
                    type: 'number',
                    required: true,
                    data: canvasData.tabIdx
                },
                {
                    label: 'Tipe',
                    type: 'select',
                    options: [
                        {
                            id: 'form',
                            name: 'Form'
                        },
                        {
                            id: 'tabel',
                            name: 'Tabel'
                        },
                        {
                            id: 'tabel-grid',
                            name: 'Tabel Grid'
                        },
                        {
                            id: 'tabel-statik',
                            name: 'Tabel Statik'
                        },
                        {
                            id: 'maps',
                            name: 'Map'
                        }
                    ],
                    required: true,
                    data: canvasData.ftype
                },
                {
                    label: 'Nama',
                    type: 'text',
                    required: false,
                    data: canvasData.fName
                },
                {
                    label: 'Web Service Awal',
                    type: 'text',
                    required: false,
                    data: canvasData.initial_ws
                },
                {
                    label: 'Data Tabel',
                    type: 'autocomplete-datatabel',
                    required: true,
                    data: canvasData.datatabel
                },
                {
                    label: 'No Urut',
                    type: 'number',
                    data: canvasData.no_urut,
                    required: true
                }
            ]
        }]
    }];

    /*** BEGIN - Autocomplete for Datatabel ***/
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.querySearch = TemplateFormFactory.querySearchDatatabel;
    $scope.simulateQuery = false;
    $scope.isDisabled = false;
    $scope.noCache = false;
    $scope.selectedItemChange = selectedItemChangeDatabel;

    //////////////////
    function selectedItemChangeDatabel(item) {
        if (angular.isDefined(item)) {
            $scope.forms[0].fields[0].field[4].data = item.id;
        } else {
            $scope.forms[0].fields[0].field[4].data = null;
        }
        $log.info($scope.forms[0].fields[0].field[4]);
    }
    /*** END - Autocomplete for Datatabel ***/

    // Load name of selected datatabel
    if (angular.isDefined(canvasData.datatabel) && canvasData.datatabel) {
        TemplateFormFactory.getDatatabelData(canvasData.datatabel).then(function (res) {
            $scope.searchText = res.data.data.nama_datatabel;
        });
    }
}

/**
 * Dialog for configuring element
 * @param $scope
 * @param $mdDialog
 * @param datatabelId
 * @param TemplateFormFactory
 */
function elmDialog($scope, $mdDialog, $log, AppFactory, TemplateFormFactory, datatabelId,
    elementFormType, currentElmType, currentElmRequired, currentElmDataKolomId, currentElmLabel,
    currentElmTautan, currentElmNoUrut, currentElmDataKolom, _
) {
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.elementFormType = elementFormType;
    $scope.validateForm = true;

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Element',
        datatabel: 'Element',
        fields: [{
            id: null,
            del: false,
            field: [{
                    label: 'Data Kolom',
                    type: 'autocomplete-datakolom',
                    datatabel_id: datatabelId,
                    data_kolom: currentElmDataKolom,
                    required: false
                },
                {
                    label: 'Label',
                    type: 'text',
                    data: currentElmLabel,
                    options: [],
                    required: true
                },
                {
                    label: 'Tipe',
                    type: 'select',
                    options: [
                        {
                            id: 'autocomplete',
                            name: 'Autocomplete'
                        },
                        {
                            id: 'barcode',
                            name: 'Barcode'
                        },
                        {
                            id: 'button-set',
                            name: 'Button Set'
                        },
                        {
                            id: 'checkbox',
                            name: 'Checkbox'
                        },
                        {
                            id: 'date',
                            name: 'Date'
                        },
                        {
                            id: 'email',
                            name: 'Email'
                        },
                        {
                            id: 'file',
                            name: 'File'
                        },
                        {
                            id: 'numbering',
                            name: 'Formatted Number'
                        },
                        {
                            id: 'hyperlink',
                            name: 'Hyperlink'
                        },
                        {
                            id: 'label',
                            name: 'Label'
                        },
                        {
                            id: 'number',
                            name: 'Number'
                        },
                        {
                            id: 'password',
                            name: 'Password'
                        },
                        {
                            id: 'photo',
                            name: 'Photo'
                        },
                        {
                            id: 'select',
                            name: 'Select'
                        },
                        {
                            id: 'select-ws',
                            name: 'Select-WS'
                        },
                        {
                            id: 'text',
                            name: 'Text'
                        },
                        {
                            id: 'textarea',
                            name: 'Textarea'
                        },
						{
                            id: 'editor',
                            name: 'Editor'
                        },
						{
                            id: 'qrcode',
                            name: 'QR Code'
                        }
                    ],
                    data: currentElmType,
                    required: true
                },
                {
                    label: 'Wajib',
                    type: 'select',
                    options: [{
                        id: true,
                        name: 'Ya'
                    }, {
                        id: false,
                        name: 'Tidak'
                    }],
                    data: (typeof (currentElmRequired) === 'boolean') ? (currentElmRequired === true ? 'true' : 'false') : '',
                    required: true
                },
                {
                    label: 'Tautan',
                    type: 'text-tautan',
                    data: currentElmTautan,
                    options: [],
                    required: true
                },
                {
                    label: 'No Urut',
                    type: 'number',
                    data: currentElmNoUrut,
                    options: [],
                    required: true
                },
                {
                    label: '',
                    type: 'hidden',
                    data: '',
                    required: false
                }
            ]
        }]
    }];

    /*** Autocomplete for Web Data Kolom ***/
    $scope.selectedItemUpdate = null;
    $scope.searchTextUpdate = null;
    $scope.querySearchUpdate = TemplateFormFactory.querySearchDataKolom;
    $scope.isDisabledUpdate = false;
    $scope.noCacheUpdate = false;
    $scope.selectedItemChangeUpdate = selectedItemChangeUpdate;

    //////////////////
    function selectedItemChangeUpdate(item) {
        if (angular.isDefined(item)) {
            $scope.forms[0].fields[0].field[0].data = item.id;
            $scope.forms[0].fields[0].field[6].data = item.label;
        } else {
            $scope.forms[0].fields[0].field[0].data = null;
            $scope.forms[0].fields[0].field[6].data = null;
        }
    }
    /*** .Autocomplete for Web Data Kolom ***/

     // Load name of selected datatabel
    if (angular.isDefined(datatabelId) && currentElmDataKolom) {

        TemplateFormFactory.querySearchDataKolom(currentElmDataKolom, datatabelId, currentElmDataKolomId).then(function (res) {
            $scope.searchTextUpdate = res[0]['label'];
            $scope.forms[0].fields[0].field[0].data = res[0]['id'];
            $scope.forms[0].fields[0].field[6].data = res[0]['label'];
        });
    }

    // Load Data Kolom dari Datatabel yang digunakan pada form tersebut
    /*if (!_.isNull(datatabelId)) {
        TemplateFormFactory.getDatatabelData(datatabelId).then(function (res) {
            if (res.data.data.hasOwnProperty('data_kolom')) {
                var dataKolomList = res.data.data.data_kolom;
                $scope.forms[0].fields[0].field[0].options = dataKolomList.map(function (dataKolom) {
                    var formatted = {};
                    formatted['id'] = dataKolom.id;
                    formatted['name'] = dataKolom.label;
                    return formatted;
                });
            } else {
                AppFactory.showToast('Kolom tidak ditemukan');
            }
        });
    }*/
}

/**
 * Dialog for defining options for select
 * @param $scope
 * @param $mdDialog
 */
function optDialog($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Option',
        datatabel: 'Option',
        fields: [{
            id: null,
            del: false,
            field: [
                {
                    label: 'Id',
                    type: 'text',
                    data: ''
                },
                {
                    label: 'Label',
                    type: 'text',
                    data: ''
                }
            ]
        }]
    }];

}

/**
 * Dialog for configuring Tab
 * @param $scope
 * @param $mdDialog
 */
function tabDialog($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Tab',
        datatabel: 'tab',
        fields: [{
            id: null,
            del: false,
            field: [{
                label: 'Label',
                type: 'text',
                required: true,
                data: ''
            }]
        }]
    }];
}

/**
 * Dialog for selecting datasource for autocomplete
 * @param $scope
 * @param $mdDialog
 * @param TemplateFormFactory
 * @param selectedKelompokDataId
 */
function sourceDialog(
    $scope, $mdDialog, $log, TemplateFormFactory, TemplateDataFactory, selectedKelompokDataId
) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;

    TemplateFormFactory.getWebServicelist().then(function (res) {
        var listKelompokData = res.data.data.items;
        var mappedList = listKelompokData.map(function (value) {
            return {
                'id': value.id,
                'name': value.template_data.keterangan + ' - ' + value.label_kelompok
            };
        });
        angular.copy(mappedList, $scope.forms[0].fields[0].field[0].options);
    });

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Web Service Combogrid',
        datatabel: 'Source',
        fields: [{
            id: null,
            del: false,
            field: [{
                label: 'Tipe Format',
                // type: 'select',
                type: 'autocomplete-kelompokdata',
                options: [],
                // data: (selectedKelompokDataId !== null) ? selectedKelompokDataId : null,
                required: true
            }]
        }]
    }];

    /*** BEGIN - Autocomplete for KelompokData ***/
    $scope.selectedItemKelompokData = null;
    $scope.searchTextKelompokData = null;
    $scope.querySearchKelompokData = TemplateDataFactory.querySearchKelompokData;
    $scope.selectedItemChangeKelompokData = selectedItemChangeKelompokData;

    //////////////////
    function selectedItemChangeKelompokData(item) {
        if (angular.isDefined(item)) {
            $scope.forms[0].fields[0].field[0].data = item.id;
        } else {
            $scope.forms[0].fields[0].field[0].data = null;
        }
    }

    // Load name of selected Kelompok data
    if (angular.isDefined(selectedKelompokDataId) && selectedKelompokDataId) {
        TemplateDataFactory.getKelompokData(selectedKelompokDataId).then(function (res) {
            var record = res.data.data;
            $scope.searchTextKelompokData = record.template_data.keterangan + ' - ' + record.label_kelompok;
        });
    }
    /*** END - Autocomplete for KelompokData ***/
}

/**
 * Dialog for configuring numbering to be used by a formatted number element
 * @param $scope
 * @param $mdDialog
 * @param TemplateFormFactory
 * @param selectedNumberingId
 */
function numberingDialog($scope, $mdDialog, TemplateFormFactory, selectedNumberingId, _) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;

    TemplateFormFactory.getNumberingList().then(function (res) {
        var listPenomoran = res.data.data.items;
        var mappedList = listPenomoran.map(function (value) {
            return {
                'id': value.id,
                'name': value.deskripsi
            };
        });
        angular.copy(mappedList, $scope.forms[0].fields[0].field[0].options);
    });

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Daftar Format Penomoran',
        datatabel: 'Source',
        fields: [{
            id: null,
            del: false,
            field: [{
                label: 'Tipe Format',
                type: 'select',
                options: [],
                data: !_.isNull(selectedNumberingId) ? selectedNumberingId : null,
                required: true
            }]
        }]
    }];
}

/**
 * Dialog for configuring action button
 * @param $scope
 * @param $mdDialog
 * @param TemplateFormFactory
 * @param selectedButtonId
 */
function actionButtonDialog($scope, $mdDialog, $log, TemplateFormFactory, ServiceEksternalFactory, type, elementData, _) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    var selectedButtonAction = elementData && elementData.hasOwnProperty('tombol_aksi') ? elementData.tombol_aksi : null;
    var buttonLink = elementData && elementData.hasOwnProperty('tombol_tautan') ? elementData.tombol_tautan : null;
    var buttonLabel = elementData && elementData.hasOwnProperty('label') ? elementData.label : null;
    var targetSimpan = elementData && elementData.hasOwnProperty('target_simpan') ? elementData.target_simpan : null;
    var serviceEksternalId = elementData && elementData.hasOwnProperty('service_eksternal_id') ? elementData.service_eksternal_id : null;
    var targetPath = elementData && elementData.hasOwnProperty('target_path') ? elementData.target_path : null;
    $scope.validateForm = true;

    TemplateFormFactory.getButtonActionList(type).then(function (res) {
        var listAction = res.data.data.items;
        var mappedList = listAction.map(function (value) {
            return {
                'id': value.kode,
                'name': value.label
            };
        });
        angular.copy(mappedList, $scope.forms[0].fields[0].field[0].options);
    });

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Pengaturan Button',
        datatabel: 'Source',
        fields: [{
            id: null,
            del: false,
            field: [
                {
                    label: 'Jenis Aksi',
                    type: 'select',
                    options: [],
                    data: !_.isNull(selectedButtonAction) ? selectedButtonAction : null,
                    required: true
                },
                {
                    label: 'Link',
                    type: 'text',
                    required: true,
                    data: buttonLink
                },
                {
                    label: 'Label',
                    type: 'text',
                    required: false,
                    data: buttonLabel
                },
                {
                    label: 'Target Simpan',
                    type: 'select-save',
                    options: [
                        {
                            id: 'internal',
                            name: 'Internal'
                        },
                        {
                            id: 'eksternal',
                            name: 'Eksternal'
                        }
                    ],
                    required: true,
                    data: targetSimpan
                },
                {
                    label: 'Web Service Eksternal',
                    type: 'autocomplete-serviceeksternal',
                    required: false,
                    data: serviceEksternalId
                },
                {
                    label: 'Target Path',
                    type: 'text-save-eksternal',
                    required: false,
                    data: targetPath
                }
            ]
        }]
    }];

    /*** Autocomplete for Web Service Eksternal ***/
    $scope.selectedItemServiceEksternal = null;
    $scope.searchTextServiceEksternal = null;
    $scope.querySearchServiceEksternal = ServiceEksternalFactory.querySearchServiceEksternal;
    $scope.isDisabledServiceEksternal = false;
    $scope.noCacheServiceEksternal = false;
    $scope.selectedItemChangeServiceEksternal = selectedItemChangeServiceEksternal;

    //////////////////
    function selectedItemChangeServiceEksternal(item) {
        if (angular.isDefined(item)) {
            $scope.forms[0].fields[0].field[4].data = item.id; // 4 is index of Service Eksternal
        } else {
            $scope.forms[0].fields[0].field[4].data = null;
        }
    }
    /*** END - Autocomplete for Web Service Eksternal ***/

    // Load name of selected Template data
    if (angular.isDefined(serviceEksternalId) && serviceEksternalId) {
        ServiceEksternalFactory.getServiceEksternal(serviceEksternalId).then(function (res) {
            $scope.searchTextServiceEksternal = res.data.data.nama;
        });
    }
    /*** .Autocomplete for Web Service Eksternal ***/
}

/**
 * Dialog for configuring button
 * @param $scope
 * @param $mdDialog
 * @param TemplateFormFactory
 * @param selectedButtonId
 */
function buttonDialog(
    $scope, $mdDialog, $log, TemplateFormFactory, ServiceEksternalFactory, selectedButtonAction,
    buttonLink, type, _
) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;

    TemplateFormFactory.getButtonActionList(type).then(function (res) {
        var listAction = res.data.data.items;
        var mappedList = listAction.map(function (value) {
            return {
                'id': value.kode,
                'name': value.label
            };
        });
        angular.copy(mappedList, $scope.forms[0].fields[0].field[0].options);
    });

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Pengaturan Button',
        datatabel: 'Source',
        fields: [{
            id: null,
            del: false,
            field: [
                {
                    label: 'Jenis Aksi',
                    type: 'select',
                    options: [],
                    data: !_.isNull(selectedButtonAction) ? selectedButtonAction : null,
                    required: true
                },
                {
                    label: 'Link',
                    type: 'text',
                    required: true,
                    data: buttonLink
                }
            ]
        }]
    }];
}

/**
 * Dialog for configuring filter
 * @param $scope
 * @param $mdDialog
 * @param TemplateFormFactory
 * @param selectedButtonId
 */
function filterDialog($scope, $mdDialog, TemplateFormFactory, selectedButtonAction, buttonLink, type) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;

    TemplateFormFactory.getButtonActionList(type).then(function (res) {
        var listAction = res.data.data.items;
        var mappedList = listAction.map(function (value) {
            return {
                'id': value.kode,
                'name': value.label
            };
        });
        angular.copy(mappedList, $scope.forms[0].fields[0].field[0].options);
    });

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Pengaturan Filter',
        datatabel: 'Source',
        fields: [{
            id: null,
            del: false,
            field: [
                {
                    label: 'Label',
                    type: 'text',
                    data: '',
                    options: [],
                    required: true
                },
                {
                    label: 'Variabel',
                    type: 'text',
                    data: '',
                    options: [],
                    required: true
                },
                {
                    label: 'Tipe',
                    type: 'select',
                    options: [
                        {
                            id: 'date',
                            name: 'Date'
                        },
                        {
                            id: 'text',
                            name: 'Text'
                        }
                    ],
                    data: '',
                    required: true
                }
            ]
        }]
    }];
}

/**
 * Dialog for editing Filter Canvas
 * @param {*} scope 
 * @param {*} mdDialog 
 * @param {*} log 
 * @param {*} canvasData 
 * @param {*} TemplateFormFactory 
 * @param {*} AlurProsesFactory 
 * @param {*} TemplateDataFactory 
 */
function editFilterCanvasDialog($scope, $mdDialog, $log, canvasData, TemplateFormFactory, AlurProsesFactory, TemplateDataFactory) {
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;

    $scope.forms = [{
        tabIdx: 0,
        ftype: 'form',
        fName: 'Canvas',
        datatabel: 'canvas',
        fields: [{
            id: null,
            del: false,
            field: [{
                label: 'Template Report',
                type: 'autocomplete-templatedata',
                required: true,
                data: canvasData.template_data_id
            }]
        }]
    }];

    /*** BEGIN - Autocomplete for TemplateData ***/
    $scope.selectedItemTemplateData = null;
    $scope.searchTextTemplateData = null;
    $scope.querySearchTemplateData = AlurProsesFactory.querySearchTemplateData;
    $scope.isDisabledTemplateData = false;
    $scope.noCacheTemplateData = false;
    $scope.selectedItemChangeTemplateData = selectedItemChangeTemplateData;

    //////////////////
    function selectedItemChangeTemplateData(item) {
        if (angular.isDefined(item)) {
            $scope.forms[0].fields[0].field[0].data = item.id;
        } else {
            $scope.forms[0].fields[0].field[0].data = null;
        }
        $log.info($scope.forms[0].fields[0].field[0]);
    }
    /*** END - Autocomplete for TemplateData ***/

    // Load name of selected Template data
    if (angular.isDefined(canvasData.template_data_id) && canvasData.template_data_id) {
        TemplateDataFactory.getTemplateData(canvasData.template_data_id).then(function (res) {
            $scope.searchTextTemplateData = res.data.data.keterangan;
        });
    }
}

/**
 * Dialog for configuring initial data for canvas
 * @param $scope
 * @param $mdDialog
 * @param canvasData
 * @param TemplateFormFactory
 */
function showInitialCanvasDialog($scope, $mdDialog, canvasData, AppFactory, TemplateFormFactory, _) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    $scope.validateForm = true;
    $scope.canvasData = canvasData;
    $scope.fields = [];

    // Load Data Kolom dari Datatabel yang digunakan pada form tersebut
    if (!_.isNull(canvasData.datatabel)) {
        var datatabelId = canvasData.datatabel;
        TemplateFormFactory.getDatatabelData(datatabelId).then(function (res) {
            var format = {
                'data': {
                    'items': {}
                }
            };
            res.data.data.data_kolom.forEach(function (field) {
                format.data.items[field.data_kolom] = '';
            });
            $scope.strJson = AppFactory.syntaxHighlight(format);
        });
    }
}
