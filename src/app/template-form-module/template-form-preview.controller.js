(function () {
    'use strict';

    angular
        .module('template-form-module')
        .controller('TemplateFormPreviewController', TemplateFormPreviewController);

    /* @ngInject */
    function TemplateFormPreviewController($http, EnvironmentConfig, ElementConfig, $stateParams, $log, AppFactory, TemplateFormFactory, FormFactory, $scope) {
        var vm = this;
        var id = $stateParams.form_id;
        var canvasId = null;

        $scope.forms = null;

        FormFactory.getForm(id, null).then(function (res) {
            var templateFormData = res.data.data;
            $scope.forms = templateFormData.canvas;

            for (var key in templateFormData.canvas) {
                if (templateFormData.canvas.hasOwnProperty(key)) {

                    // Only for tabel-grid
                    if (templateFormData.canvas[key].ftype === 'tabel-grid') {
                        var canvas = templateFormData.canvas[key].fields;
                        canvasId = templateFormData.canvas[key].id;
                        for (var key2 in canvas) {

                            if (canvas.hasOwnProperty(key2)) {
                                var fields = canvas[key2].field;

                                for (var key3 in fields) {
                                    if (fields.hasOwnProperty(key3)) {

                                        var field = fields[key3];
                                        switch (field.type) {
                                            case 'date':
                                                field.data = new Date(field.data);
                                                break;
                                        }
                                    }
                                }
                            }
                        }

                        activate();
                    }
                }
            }
        });

        vm.cancelAction = TemplateFormFactory.cancelAction;
        vm.saveAndNext = saveAndNext;

        $scope.deleteData = function (data) {
            data.del = true;
        };

        $scope.addData = function (data) { //menambah row tabel
            var template = {};
            template = angular.copy(data[0]);
            template.del = false;
            template.id = data.length;
            for (var i = 0; i < template.field.length; i++) {
                template.field[i].data = null;
            }
            data.push(template);
        };

        $scope.save = function () {
            alert(angular.toJson($scope.forms)); //json forms akan di post ke webservice untuk disimpan isi data-nya ke setiap datatabel masing-masing
        };

        function saveAndNext() {
            alert(angular.toJson($scope.forms)); //json forms akan di post ke webservice untuk disimpan isi data-nya ke setiap datatabel masing-masing
        }

        $scope.clickButton = clickButton;

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
            $scope.$watch('vm.query.filter', function (newValue, oldValue) {
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

        function getData() {
            FormFactory.getGridData(canvasId, vm.query).then(function (res) {
                vm.data = res.data.data;
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
            return;
        }
    }
})();
