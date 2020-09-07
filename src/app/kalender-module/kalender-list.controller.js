(function() {
    'use strict';

    angular
        .module('kalender-module')
        .controller('KalenderListController', KalenderListController);

    /* @ngInject */
    function KalenderListController($state, $scope, ElementConfig, UnitFactory) {
        var vm = this;

        vm.showFormEdit = function(id) {
            $state.go('triangular.admin-default.kalender-edit', { 'instansi_id': id });
        };
        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.kalender-view', { 'instansi_id': id });
        };

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
        activate();

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
            UnitFactory.getPagedInstansi(vm.query).then(function(res) {
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
    }
})();