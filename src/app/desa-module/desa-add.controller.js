(function() {
    'use strict';

    angular
        .module('desa-module')
        .controller('DesaAddController', DesaAddController);

    /* @ngInject */
    function DesaAddController($http, $state, EnvironmentConfig, $log, AppFactory, DesaFactory) {
        var vm = this;
        vm.desa = {
            kode_daerah: '',
            nama_daerah: '',
            kecamatan_id: 0
        };

        /*** BEGIN - Autocomplete for Kecamatan ***/
        vm.selectedItem       = null;
        vm.searchText         = null;
        vm.querySearch        = DesaFactory.querySearchKecamatan;
        vm.simulateQuery      = false;
        vm.isDisabled         = false;
        vm.noCache            = true;
        vm.selectedItemChange = selectedItemChangeKecamatan;

        //////////////////
        function selectedItemChangeKecamatan(item) {
            if (angular.isDefined(item)){
                $log.info('Item changed to ' + item);
                vm.desa.kecamatan_id = item.id;
            }
        }
        /*** END - Autocomplete for Kecamatan ***/

        vm.createAction = createAction;
        vm.cancelAction = DesaFactory.cancelAction;

        function createAction() {
            var reqData = vm.desa;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'desa',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.desa');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
