(function() {
    'use strict';

    angular
        .module('kecamatan-module')
        .controller('KecamatanEditController', KecamatanEditController);

    /* @ngInject */
    function KecamatanEditController($http, $state, $scope, EnvironmentConfig, ElementConfig, $stateParams, $log, AppFactory, KecamatanFactory, DesaFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.kecamatan = {
            id: id,
            kode_daerah: '',
            nama_daerah: '',
            kabupaten_id: 0
        };

        KecamatanFactory.getKecamatan(id).then(function(res) {
            angular.copy(res.data.data, vm.kecamatan);
            vm.searchText = res.data.data.kabupaten.nama_daerah;
        });

        vm.updateAction = updateAction;
        vm.cancelAction = KecamatanFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'kode_daerah': vm.kecamatan.kode_daerah,
                'nama_daerah': vm.kecamatan.nama_daerah,
                'kabupaten_id': vm.kecamatan.kabupaten_id
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'kecamatan/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.kecamatan');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for Kabupaten ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = KecamatanFactory.querySearchKabupaten;
        vm.simulateQuery = false;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChange;

        //////////////////
        function selectedItemChange(item) {
            if (angular.isDefined(item)) {
                $log.info('Item changed to ' + item);
                vm.kecamatan.kabupaten_id = item.id;
            }
        }
        /*** END - Autocomplete for Kabupaten ***/

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
            vm.query.kecamatan_id = id;
            DesaFactory.getPagedDesa(vm.query).then(function(res) {
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