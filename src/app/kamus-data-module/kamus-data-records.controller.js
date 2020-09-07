(function() {
    'use strict';

    angular
        .module('kamus-data-module')
        .controller('DatatabelRecordsController', DatatabelRecordsController);

    /* @ngInject */
    function DatatabelRecordsController($scope, $stateParams, KamusDataFactory, ElementConfig) {
        var vm = this;
        var id = $stateParams.id;
        var tableStructureLoaded = false;
        vm.datatabel = {};
        vm.items = [];

        KamusDataFactory.getDatatabel(id).then(function (res) {
            angular.copy(res.data.data, vm.datatabel);
            tableStructureLoaded = true;
            activate();
            vm.getData();
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
            $scope.$watch('vm.query.filter', function(newValue, oldValue) {
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
            if (tableStructureLoaded) {
                KamusDataFactory.getPagedRecords(vm.datatabel.id, vm.query).then(function(res) {
                    vm.data = res.data.data;
                });
            }
        }

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }
        /*** END - Advance Table ***/

        vm.cancelAction = KamusDataFactory.cancelAction;
    }
})();
