(function() {
    'use strict';

    angular
        .module('pengguna-rest-module')
        .controller('PenggunaRestEditController', PenggunaRestEditController);

    /* @ngInject */
    function PenggunaRestEditController(
        $http, $state, EnvironmentConfig, $stateParams, $log, $scope,
        $mdDialog, AppFactory, PenggunaRestFactory, usernameFilter, UnitFactory
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
        PenggunaRestFactory.getPengguna(id).then(function(res) {
            angular.copy(res.data.data, vm.pengguna);
            vm.pengguna.is_active = vm.pengguna.is_active === 1 ? true : false;

            if (angular.isDefined(vm.pengguna.instansi)) {
                vm.searchTextInstansi = vm.pengguna.instansi.nama;
            }
        });

        vm.usernameChange = usernameChange;
        vm.updateAction = updateAction;
        vm.cancelAction = PenggunaRestFactory.cancelAction;

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
                url: EnvironmentConfig.api + 'rest_users/' + vm.pengguna.id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.pengguna-rest');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - Main Form ***/

        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItemInstansi       = null;
        vm.searchTextInstansi         = null;
        vm.querySearchInstansi        = UnitFactory.querySearchInstansi;
        vm.isDisabledInstansi         = false;
        vm.noCacheInstansi            = true;
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
