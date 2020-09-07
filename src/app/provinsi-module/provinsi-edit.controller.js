(function() {
    'use strict';

    angular
        .module('provinsi-module')
        .controller('ProvinsiEditController', ProvinsiEditController);

    /* @ngInject */
    function ProvinsiEditController($http, $state, $scope, EnvironmentConfig, ElementConfig, $stateParams, AppFactory, ProvinsiFactory, KabupatenFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.provinsi = {
            id: id,
            kode_daerah: '',
            nama_daerah: ''
        };

        ProvinsiFactory.getProvinsi(id).then(function(res) {
            angular.copy(res.data.data, vm.provinsi);
        });

        vm.updateAction = updateAction;
        vm.cancelAction = ProvinsiFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'kode_daerah': vm.provinsi.kode_daerah,
                'nama_daerah': vm.provinsi.nama_daerah
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'provinsi/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.provinsi');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

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
            vm.query.provinsi_id = id;
            KabupatenFactory.getPagedKabupaten(vm.query).then(function(res) {
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
