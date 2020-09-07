(function() {
    'use strict';

    angular
        .module('kabupaten-module')
        .controller('KabupatenViewController', KabupatenViewController);

    /* @ngInject */
    function KabupatenViewController($scope, $stateParams, ElementConfig, KabupatenFactory, KecamatanFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.kabupaten = {};

        KabupatenFactory.getKabupaten(id).then(function(res) {
            angular.copy(res.data.data, vm.kabupaten);
        });

        vm.cancelAction = KabupatenFactory.cancelAction;

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
            vm.query.kabupaten_id = id;
            KecamatanFactory.getPagedKecamatan(vm.query).then(function(res) {
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