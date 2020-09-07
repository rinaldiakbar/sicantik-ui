(function() {
    'use strict';

    angular
        .module('rest-service-module')
        .controller('RestServiceAddController', RestServiceAddController);

    /* @ngInject */
    function RestServiceAddController(
        $http, $state, EnvironmentConfig, $log,
        AppFactory, RestServiceFactory, UnitFactory, TemplateFormFactory
    ) {
        var vm = this;

        /*** BEGIN - Main Form ***/
        vm.restService = {
            is_active: 0,
            datatabel_id: null,
            instansi_id: null
        };

        vm.createAction = createAction;
        vm.cancelAction = RestServiceFactory.cancelAction;

        function createAction() {
            var reqData = {
                'datatabel_id': vm.restService.datatabel_id,
                'instansi_id': vm.restService.instansi_id,
                'is_active': vm.restService.is_active ? 1 : 0
            };

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'rest_services',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.rest-service');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - Main Form ***/

        /*** BEGIN - Autocomplete for Datatabel ***/
        vm.selectedItemDatatabel       = null;
        vm.searchTextDatatabel         = null;
        vm.querySearchDatatabel        = TemplateFormFactory.querySearchDatatabel;
        vm.isDisabledDatatabel         = false;
        vm.noCacheDatatabel            = true;
        vm.selectedItemChangeDatatabel = selectedItemChangeDatatabel;

        function selectedItemChangeDatatabel(item) {
            if (angular.isDefined(item)) {
                vm.restService.datatabel_id = item.id;
            } else {
                vm.restService.datatabel_id = null;
            }
        }
        /*** END - Autocomplete for Datatabel ***/

        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItemInstansi       = null;
        vm.searchTextInstansi         = null;
        vm.querySearchInstansi        = UnitFactory.querySearchInstansi;
        vm.isDisabledInstansi         = false;
        vm.noCacheInstansi            = true;
        vm.selectedItemChangeInstansi = selectedItemChangeInstansi;

        function selectedItemChangeInstansi(item) {
            if (angular.isDefined(item)) {
                vm.restService.instansi_id = item.id;
            } else {
                vm.restService.instansi_id = null;
            }
        }
        /*** END - Autocomplete for Instansi ***/
    }
})();
