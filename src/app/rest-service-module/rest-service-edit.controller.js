(function() {
    'use strict';

    angular
        .module('rest-service-module')
        .controller('RestServiceEditController', RestServiceEditController);

    /* @ngInject */
    function RestServiceEditController(
        $http, $state, EnvironmentConfig, $stateParams, $log, $scope, $mdDialog,
        AppFactory, RestServiceFactory, TemplateFormFactory, UnitFactory
    ) {
        var vm = this;
        var id = $stateParams.id;
        vm.api_url = EnvironmentConfig.api.replace('/api/', '/rest/');

        /*** BEGIN - Main Form ***/
        vm.restService = {
            id: id,
            datatabel_id: null,
            instansi_id: null,
            is_active: 0
        };

        // GET the original Data
        RestServiceFactory.getRestService(id).then(function(res) {
            angular.copy(res.data.data, vm.restService);
            vm.restService.is_active = vm.restService.is_active === 1 ? true : false;

            if (res.data.data.datatabel) {
                vm.searchTextDatatabel = res.data.data.datatabel.nama_datatabel;
            }

            if (res.data.data.instansi) {
                vm.searchTextInstansi = res.data.data.instansi.nama;
            }
        });

        vm.updateAction = updateAction;
        vm.cancelAction = RestServiceFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'datatabel_id': vm.restService.datatabel_id,
                'instansi_id': vm.restService.instansi_id,
                'is_active': vm.restService.is_active ? 1 : 0
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'rest_services/' + vm.restService.id,
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
