(function () {
    'use strict';

    angular
        .module('pengguna-gateway-module')
        .controller('PenggunaGatewayEditController', PenggunaGatewayEditController);

    /* @ngInject */
    function PenggunaGatewayEditController(
        $http, $state, EnvironmentConfig, $stateParams, $log, $scope,
        $mdDialog, AppFactory, PenggunaGatewayFactory, usernameFilter, UnitFactory
    ) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.pengguna = {
            id: id,
            username: '',
            password: '',
            is_active: true,
            instansi_id: null
        };
        vm.unit = [];

        // GET the original Data
        PenggunaGatewayFactory.getPengguna(id).then(function (res) {
            angular.copy(res.data.data, vm.pengguna);
            vm.pengguna.is_active = vm.pengguna.is_active === 1 ? true : false;

            if (angular.isDefined(vm.pengguna.instansi)) {
                vm.searchTextInstansi = vm.pengguna.instansi.nama;
            }
            initUnitAutocomplete();
        });

        vm.usernameChange = usernameChange;
        vm.updateAction = updateAction;
        vm.cancelAction = PenggunaGatewayFactory.cancelAction;

        function usernameChange() {
            vm.pengguna.username = usernameFilter(vm.pengguna.username);
        }

        function updateAction() {
            var reqData = {
                'username': vm.pengguna.username,
                'password': vm.pengguna.password,
                'is_active': vm.pengguna.is_active ? 1 : 0,
                'instansi_id': vm.pengguna.instansi_id
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'gateway_users/' + vm.pengguna.id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.pengguna-gateway');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - Main Form ***/


        /*** BEGIN - Tab Unit ***/
        vm.addNewUnit = function () {
            vm.unit.push({
                'nama': ''
            });
            initUnitAutocomplete();
        };

        vm.removeUnit = function (index) {
            if (angular.isDefined(vm.unit[index]._joinData)) {
                var unitId = vm.unit[index]._joinData.unit_id;
                var dialog = {
                    title: 'Apakah anda yakin?',
                    content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                    ok: 'Ya',
                    cancel: 'Tidak'
                };

                $mdDialog.show(
                    $mdDialog.confirm()
                    .title(dialog.title)
                    .textContent(dialog.content)
                    .ok(dialog.ok)
                    .cancel(dialog.cancel)
                ).then(function () {
                    PenggunaGatewayFactory.deleteUnit(vm.pengguna.id, unitId).then(function () {
                        vm.unit.splice(index, 1);
                        initUnitAutocomplete();
                    });
                });
            } else {
                vm.unit.splice(index, 1);
                initUnitAutocomplete();
            }
        };

        vm.searchTextUnit = [];
        vm.querySearchUnit = PenggunaGatewayFactory.querySearchUnit;
        vm.selectedItemChangeUnit = selectedItemChangeUnit;

        function initUnitAutocomplete() {
            vm.unit.forEach(function (unit, index) {
                vm.searchTextUnit[index] = unit.nama;
            });
        }

        function selectedItemChangeUnit(item, index) {
            if (angular.isDefined(item)) {
                vm.unit[index].id = item.id;
                vm.unit[index].nama = item.nama;
            } else {
                vm.unit[index].id = null;
            }
        }
        /*** END - Tab Unit ***/


        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItemInstansi = null;
        vm.searchTextInstansi = null;
        vm.querySearchInstansi = UnitFactory.querySearchInstansi;
        vm.isDisabledInstansi = false;
        vm.noCacheInstansi = true;
        vm.selectedItemChangeInstansi = selectedItemChangeInstansi;

        function selectedItemChangeInstansi(item) {
            if (angular.isDefined(item)) {
                vm.pengguna.instansi_id = item.id;
            } else {
                vm.pengguna.instansi_id = null;
            }
        }
        /*** END - Autocomplete for Instansi ***/
    }
})();
