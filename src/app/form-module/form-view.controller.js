(function () {
    'use strict';

    angular
        .module('form-module')
        .controller('FormViewController', FormViewController);

    /* @ngInject */
    function FormViewController(
        $http, $stateParams, $log, $scope, $state, $mdMedia, $mdDialog, $timeout, $window, $document,
        $filter, AppFactory, FormFactory, MenuService, Upload, EnvironmentConfig, _,
        APP_CONFIG, DYNAMIC
    ){

        var vm = this;
        var formId = $stateParams.form_id;
        var keyId = $stateParams.key_id;
        var withRecord = false;
        if (angular.isDefined(keyId) && keyId.length > 0) {
            withRecord = true;
        }

        $scope.forms = null;
        $scope.isReadOnly = true;
        vm.cancelAction = FormFactory.cancelView;
        vm.save = function () {};
        vm.saveAndNext = function () {};
        vm.openLink = MenuService.openLink;
        $scope.isViewable = isViewable;
        $scope.viewFile = viewFile;

        $scope.addData = function () {}; // dummy function as adding data is not allowed in this page
        $scope.deleteData = function () {}; // dummy function as deleting data is not allowed in this page
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
                                    }

                                }
                            }

                        }

                    }

                }
            }

            $scope.onLoadFunc = function () {};
        });

        function clickButton(formId, datatabelId, keyId, tautan, actionType) {
            switch (actionType) {
                case 'save':
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

        /** BEGIN - File Upload **/
        $scope.uploadFile = function () {};
        $scope.downloadFile = downloadFile;

        function downloadFile(filename) {
            $window.open(EnvironmentConfig.api + 'Form/downloadFile?filename=' + filename, '_blank');
        }
        /** END - File Upload **/

        function viewFile(filePath) {
            FormFactory.viewFile(filePath, $scope, $document.body);
        }
    }
})();