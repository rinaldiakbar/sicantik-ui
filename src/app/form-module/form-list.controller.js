(function () {
    'use strict';

    angular
        .module('form-module')
        .controller('FormListController', FormListController);

    /* @ngInject */
    function FormListController(
        $stateParams, $log, APP_CONFIG, DYNAMIC, EnvironmentConfig, ElementConfig, $window,
        $scope, $mdDialog, $timeout, FormFactory, AppFactory, MenuService, Upload, _
    ) {
        var vm = this;
        var formId = $stateParams.form_id;
        var canvasId = null;

        vm.gridData = [];
        vm.openLink = MenuService.openLink;

        $scope.forms = null;
        $scope.formId = formId;
        $scope.keyId = null;
        $scope.clickButton = clickButton;
        $scope.showGridNo = ElementConfig.showGridNo;
        $scope.DYNAMIC = DYNAMIC;

        FormFactory.getForm(formId, null, true).then(function (res) {
            var templateFormData = res.data.data;
            $scope.nama_form = templateFormData.nama_form;
            $scope.has_filter = templateFormData.has_filter;
            $scope.has_tabel_grid = templateFormData.has_tabel_grid;
            $scope.forms = templateFormData.canvas;

            for (var key in templateFormData.canvas) {
                if (templateFormData.canvas.hasOwnProperty(key)) {
                    var canvas = templateFormData.canvas[key].fields;
                    var formType = templateFormData.canvas[key].ftype;

                    if (formType !== 'action') {
                        canvasId = templateFormData.canvas[key].id;
                    }

                    for (var key2 in canvas) {

                        if (canvas.hasOwnProperty(key2)) {
                            var fields = canvas[key2].field;

                            for (var key3 in fields) {
                                if (fields.hasOwnProperty(key3)) {

                                    var field = fields[key3];
                                    switch (field.type) {
                                        case 'date':
                                            if (!_.isNull(field.data)) {
                                                field.data = moment(field.data, APP_CONFIG.datepickerFormat).toDate();
                                            } else {
                                                field.data = new Date();
                                            }
                                            break;
                                        case 'select-ws':
                                            if (field.options) {
                                                field.options = angular.fromJson(field.options);
                                            }
                                            break;
                                    }

                                    // Initialize the model for filter
                                    if (formType === 'filter') {
                                        vm.query[field.variable_name] = field.data;
                                    }
                                }
                            }

                        }

                    }

                }
            }

            // Request to get grid data
            $timeout(function () {
                activate();
            });
        });


        /*** BEGIN - Advance Table ***/
        vm.query = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-id',
            page: 1
        };

        vm.filter = {
            options: {
                debounce: 500
            }
        };
        vm.getData = getData;
        vm.removeFilter = removeFilter;

        ///////////
        function activate() {
            var bookmark;

            for (var filterKey in vm.query) {
                if (vm.query.hasOwnProperty(filterKey)) {
                    var filterValue = vm.query[filterKey];
                    $scope.$watch('vm.query.' + filterKey, function (newValue, oldValue) {
                        if (!oldValue) {
                            bookmark = vm.query.page;
                        }

                        if (!newValue) {
                            vm.query.page = bookmark;
                        }

                        if (newValue !== oldValue) {
                            vm.getData();
                        }
                    });
                }
            }

            vm.getData();
        }

        function getData() {
            FormFactory.getGridData(canvasId, vm.query).then(function (res) {
                vm.gridData = angular.copy(res.data.data);
            });
        }

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }
        /*** END - Advance Table ***/

        function clickButton(formId, datatabelId, keyId, tautan, actionType) {
            switch (actionType) {
                case 'delete':
                    var dialog = {
                        title: 'Apakah anda yakin?',
                        content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                        ok: 'Ya',
                        cancel: 'Tidak'
                    };

                    $mdDialog.show(
                        $mdDialog.confirm()
                        .title(dialog.title)
                        .textContent(dialog.content)
                        .ok(dialog.ok)
                        .cancel(dialog.cancel)
                    ).then(function () {
                        FormFactory.deleteData(formId, datatabelId, keyId).then(getData());
                    });
                    break;
                case 'save':
                    FormFactory.saveData(formId, keyId, $scope.nama_form, $scope.forms, tautan);
                    break;
                case 'edit':
                case 'view':
                    if (typeof (keyId) === 'undefined') {
                        AppFactory.showToast('Key ID not Provided');
                    } else {
                        MenuService.openLink(tautan, formId, keyId);
                    }
                    break;
                case 'add':
                    MenuService.openLink(tautan, formId, null);
                    break;
                case 'cancel':
                    MenuService.openLink(tautan, formId, null);
                    break;
                case 'report':
                    FormFactory.downloadReport(tautan, keyId, null);
                    break;
                default:
                    MenuService.openLink(tautan, formId, keyId);
                    break;
            }
        }

        /** BEGIN - Multiple File Upload Field **/
        var fileList = [];
        $scope.uploadFile = uploadFile;
        $scope.downloadFile = downloadFile;

        function uploadFile($files, data) {
            if (!_.isNull($files) && $files.length > 0) {
                fileList = $files;

                uploadStarted(data);

                // $timeout(uploadComplete, 4000);

                Upload.upload({
                    url: EnvironmentConfig.api + 'Form/uploadFile',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.data.data.file_name + ' uploaded. Response: ' + resp.data.message);
                    data.data = resp.data.data.file_name;
                    data.file_url = resp.data.data.file_url;
                    uploadComplete(data);
                }, function (resp) {
                    $log.info('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }

        function uploadStarted(data) {
            data.upload_status = 'uploading';
        }

        function uploadComplete(data) {
            data.upload_status = 'complete';
            var message = 'Berhasil upload ';

            for (var file in fileList) {
                message += fileList[file].name + ' ';
            }

            AppFactory.showToast(message);
            $timeout(uploadReset(data), 3000);

            fileList = null;
        }

        function uploadReset(data) {
            data.upload_status = 'idle';
        }

        function downloadFile(filename) {
            $window.open(EnvironmentConfig.api + 'Form/downloadFile?filename=' + filename, '_blank');
        }
        /** END - Multiple File Upload Field **/
    }
})();