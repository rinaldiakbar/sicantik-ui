(function () {
    'use strict';

    angular
        .module('form-module')
        .controller('FormRenderController', FormRenderController);

    /* @ngInject */
    function FormRenderController(
        $http, $stateParams, $log, $scope, $state, $mdMedia, $mdDialog, $timeout, $window, $document,
        $filter, AppFactory, FormFactory, MenuService, Upload, EnvironmentConfig, _,
        APP_CONFIG, DYNAMIC
    ) {
        var vm = this;
        var formId = $stateParams.form_id;
        var keyId = $stateParams.key_id;
        var withRecord = false;
        if (angular.isDefined(keyId) && keyId.length > 0) {
            withRecord = true;
        }

        $scope.forms = null;
        vm.cancelAction = FormFactory.cancelAction;
        vm.save = save;
        vm.openLink = MenuService.openLink;
        $scope.isViewable = isViewable;
        $scope.viewFile = viewFile;

        $scope.addData = addData;
        $scope.deleteData = softDeleteData;
        $scope.formId = formId;
        $scope.keyId = keyId;
        $scope.clickButton = clickButton;
        $scope.DYNAMIC = DYNAMIC;

        FormFactory.getForm(formId, keyId, withRecord).then(function (res) {
            var templateFormData = res.data.data;
            $scope.nama_form = templateFormData.nama_form;
            $scope.has_filter = templateFormData.has_filter;
            $scope.has_tabel_grid = templateFormData.has_tabel_grid;
            $scope.forms = templateFormData.canvas;
            $scope.otomatis_update = templateFormData.otomatis_update;

            for (var key in templateFormData.canvas) {
                if (templateFormData.canvas.hasOwnProperty(key)) {

                    var canvas = templateFormData.canvas[key].fields;
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
                                        case 'file':
                                            field.editable = _.isNull(field.data) || !field.data.includes('http');
                                            break;
                                    }

                                }
                            }

                        }

                    }

                }
            }

            $scope.onLoadFunc = onLoadFunc;
        });

        function softDeleteData(data) {
            data.del = true;
        }

        function addData(data) { //menambah row tabel
            var template = {};
            template = angular.copy(data[0]);
            template.del = false;
            template.id = null;
            for (var i = 0; i < template.field.length; i++) {
                template.field[i].data = null;
            }
            data.push(template);
        }

        function save() {
            FormFactory.saveData(formId, keyId, $scope.nama_form, $scope.forms);
        }

        function clickButton(formId, datatabelId, keyId, tautan, actionType, buttonId) {
            switch (actionType) {
                case 'save':
                    FormFactory.saveData(formId, keyId, $scope.nama_form, $scope.forms, tautan, buttonId);
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

        // Execute On Load Function to send form data to web service
        function onLoadFunc(form) {
            switch (form.ftype) {
                case 'form':
                    // only send if it's in edit mode and need to be updated automatically
                    if (keyId && $scope.otomatis_update === 1) {
                        FormFactory.saveData(formId, keyId, $scope.nama_form, $scope.forms, null, -1);
                    }
                    break;
            }
        }

        /** BEGIN - File Upload **/
        var fileList;
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
                }, function (resp) { // Error Upload
                    $timeout(uploadReset(data), 3000);
                    $log.info('Error status: ' + resp.status);

                    var errorMessage = 'Terjadi kesalahan saat upload data. Mohon periksa setting server.';
                    if (resp.data && resp.data.message) {
                        errorMessage = resp.data.message;
                    }
                    AppFactory.showToast(errorMessage);

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
        /** END - File Upload **/

        // TODO move this to a helper
        function isViewable(fileName) {
            if (['pdf','png','jpeg','jpg','svg','bmp'].includes(fileName.split('.').pop())) {
                return true;
            }
            return false;
        }

        function viewFile(filePath) {
            FormFactory.viewFile(filePath, $scope, $document.body);
        }
    }
})();