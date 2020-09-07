(function () {
    'use strict';

    angular
        .module('form-module')
        .controller('FormReportGridController', FormReportGridController);

    /* @ngInject */
    function FormReportGridController(
        $stateParams, $log, $scope, $mdDialog, $timeout, FormFactory, AppFactory,
        APP_CONFIG, ElementConfig, _
    ) {
        var vm = this;
        var formId = $stateParams.form_id;
        var canvasId = null;
        var canvasTypes = [];

        vm.query = {};
        vm.data = [];
        vm.gridData = [];
        vm.getReportData = getReportData;
        vm.downloadData = downloadData;
        vm.hasRecord = false;
        vm.filterCanvas = filterCanvas;

        $scope.nama_form = null;
        $scope.has_filter = true;
        $scope.forms = null;
        $scope.formId = formId;
        $scope.keyId = null;
        $scope.canvas_template_data_id = null;

        /*** Get Canvas for Filter and Table ***/
        FormFactory.getForm(formId, null, false).then(function (res) {
            var templateFormData = res.data.data;
            $scope.nama_form = templateFormData.nama_form;
            $scope.has_filter = templateFormData.has_filter;
            $scope.forms = templateFormData.canvas;
            $scope.canvas_template_data_id = templateFormData.canvas_template_data_id;

            for (var key in templateFormData.canvas) {
                if (templateFormData.canvas.hasOwnProperty(key)) {
                    var canvas = templateFormData.canvas[key].fields;
                    var formType = templateFormData.canvas[key].ftype;

                    if (formType !== 'action') {
                        canvasId = templateFormData.canvas[key].id;
                    }

                    // Push the form type to canvasTypes
                    if (canvasTypes.indexOf(formType) === -1) {
                        canvasTypes.push(formType);
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
        /*** .Get Canvas for Filter and Table ***/

        /**
         * Filter displayed canvas
         */
        function filterCanvas(item) {
            return item.tabIdx === 0 && item.ftype === 'tabel-grid';
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
                // If the canvasTypes contains form typed canvas
                if (canvasTypes.indexOf('form') > -1) {
                    FormFactory.getForm(formId, null, true, 'form', vm.query).then(function (res) {
                        vm.data = angular.copy(res.data.data);
                        vm.hasRecord = true;
                    });
                }

                // Request to get grid data
                if (canvasTypes.indexOf('tabel-grid') > -1) {
                    $timeout(function () {
                        activate();
                    });
                }
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
        /*** .Get Report Data ***/


        /*** BEGIN - Advance Table ***/
        vm.query['filter'] = '';
        vm.query['limit'] = ElementConfig.gridRow;
        vm.query['order'] = '-id';
        vm.query['page'] = 1;

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
                vm.hasRecord = true;
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

    }
})();