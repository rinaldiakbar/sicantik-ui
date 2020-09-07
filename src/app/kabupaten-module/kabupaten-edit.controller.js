(function() {
    'use strict';

    angular
        .module('kabupaten-module')
        .controller('KabupatenEditController', KecamatanEditController);

    /* @ngInject */
    function KecamatanEditController($http, $state, $scope, EnvironmentConfig, ElementConfig, $stateParams, $log, AppFactory, KabupatenFactory, KecamatanFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.kabupaten = {
            id: id,
            kode_daerah: '',
            nama_daerah: '',
            provinsi_id: 0
        };

        KabupatenFactory.getKabupaten(id).then(function(res) {
            angular.copy(res.data.data, vm.kabupaten);
            vm.searchText = res.data.data.provinsi.nama_daerah;
        });

        vm.updateAction = updateAction;
        vm.cancelAction = KabupatenFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'kode_daerah': vm.kabupaten.kode_daerah,
                'nama_daerah': vm.kabupaten.nama_daerah,
                'kabupaten_id': vm.kabupaten.provinsi_id
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'kabupaten/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.kabupaten');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for Provinsi ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = KabupatenFactory.querySearchProvinsi;
        vm.simulateQuery = false;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChange;

        //////////////////
        function selectedItemChange(item) {
            if (angular.isDefined(item)) {
                $log.info('Item changed to ' + item);
                vm.kabupaten.provinsi_id = item.id;
            }
        }
        /*** END - Autocomplete for Provinsi ***/

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