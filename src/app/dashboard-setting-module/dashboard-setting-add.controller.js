(function () {
    'use strict';

    angular
        .module('dashboard-setting-module')
        .controller('DashboardSettingAddController', DashboardSettingAddController);

    /* @ngInject */
    function DashboardSettingAddController($http, $state, EnvironmentConfig, $log,
        AppFactory, DashboardSettingFactory, UnitFactory
    ) {
        var vm = this;
        vm.page = {
            title: null,
            instansi_id: null
        };

        vm.createAction = createAction;
        vm.cancelAction = DashboardSettingFactory.cancelAction;

        function createAction() {
            var reqData = vm.page;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pages',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.dashboard-setting');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }


        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItemInstansi = null;
        vm.searchTextInstansi = null;
        vm.querySearchInstansi = UnitFactory.querySearchInstansi;
        vm.isDisabledInstansi = false;
        vm.noCacheInstansi = true;
        vm.selectedItemChangeInstansi = selectedItemChangeInstansi;

        function selectedItemChangeInstansi(item) {
            if (angular.isDefined(item)) {
                vm.page.instansi_id = item.id;
            } else {
                vm.page.instansi_id = null;
                vm.searchTextInstansi = null;
            }
        }
        /*** END - Autocomplete for Instansi ***/
    }
})();
