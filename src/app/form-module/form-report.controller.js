(function () {
    'use strict';

    angular
        .module('form-module')
        .controller('FormReportController', FormReportController);

    /* @ngInject */
    function FormReportController(
        $stateParams, $log, $scope, APP_CONFIG, $mdDialog, $timeout, FormFactory, AppFactory, _
    ) {
        var vm = this;
        var formId = $stateParams.form_id;

        vm.query = {};
        vm.getReportData = getReportData;
        vm.downloadData = downloadData;
        vm.hasRecord = false;
        vm.enableDownload = false;
        vm.filterCanvas = filterCanvas;

        $scope.nama_form = null;
        $scope.has_filter = true;
        $scope.forms = null;
        $scope.formId = formId;
        $scope.keyId = null;
        $scope.canvas_template_data_id = null;
        $scope.recordForms = [];

        /*** Get Form Filter Only ***/
        FormFactory.getForm(formId, null, false, 'filter').then(function (res) {
            var templateFormData = res.data.data;
            $scope.nama_form = templateFormData.nama_form;
            $scope.has_filter = templateFormData.has_filter;
            $scope.forms = templateFormData.canvas;
            $scope.canvas_template_data_id = templateFormData.canvas_template_data_id;

            for (var key in templateFormData.canvas) {
                if (templateFormData.canvas.hasOwnProperty(key)) {

                    var canvas = templateFormData.canvas[key].fields;
                    var formType = templateFormData.canvas[key].ftype;

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
        });
        /*** .Get Form Filter Only ***/

        /**
         * Filter displayed canvas
         */
        function filterCanvas(item) {
            return item.tabIdx === 0 &&
                (item.ftype === 'tabel' || item.ftype === 'tabel-statik' || item.ftype === 'form');
        }

        /**
         * Get Report Data
         */
        function getReportData() {
            // If filter canvas has template_data_id 
            if ($scope.canvas_template_data_id) {
                // Download the report
                FormFactory.downloadReport($scope.canvas_template_data_id, null, vm.query); // Key ID will be null
            } else {
                // Display the data
                FormFactory.getForm(formId, null, true, 'tabel, tabel-statik, form', vm.query).then(function (res) {
                    var formData = res.data.data;
                    $scope.recordForms = formData.canvas;
                    vm.hasRecord = true;
                });
            }
        }

        function downloadData(outputType) {
            switch (outputType) {
                case 'pdf':
                    FormFactory.downloadData(formId, null, 'pdf', vm.query);
                    break;
                case 'xls':
                    FormFactory.downloadData(formId, null, 'xls', vm.query);
                    break;
            }
        }

    }
})();