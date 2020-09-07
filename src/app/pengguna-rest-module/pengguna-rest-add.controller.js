(function() {
    'use strict';

    angular
        .module('pengguna-rest-module')
        .controller('PenggunaRestAddController', PenggunaRestAddController);

    /* @ngInject */
    function PenggunaRestAddController(
        $http, $state, EnvironmentConfig, $log, AppFactory, PenggunaRestFactory,
        usernameFilter, UnitFactory
    ) {
        var vm = this;

        /*** BEGIN - Main Form ***/
        vm.pengguna = {
            username: '',
            password: '',
            is_active: true,
            instansi_id: null
        };
        vm.unit = [];

        vm.usernameChange = usernameChange;
        vm.createAction = createAction;
        vm.cancelAction = PenggunaRestFactory.cancelAction;

        function usernameChange() {
            vm.pengguna.username = usernameFilter(vm.pengguna.username);
        }

        function createAction() {
            var reqData = vm.pengguna;

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'rest_users/',
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
