(function() {
    'use strict';

    angular
        .module('kabupaten-module')
        .controller('KabupatenAddController', KabupatenAddController);

    /* @ngInject */
    function KabupatenAddController($http, $state, EnvironmentConfig, $log, AppFactory, KabupatenFactory) {
        var vm = this;
        vm.kabupaten = {
            kode_daerah: '',
            nama_daerah: '',
            provinsi_id: 0
        };

        vm.createAction = createAction;
        vm.cancelAction = KabupatenFactory.cancelAction;

        function createAction() {
            var reqData = vm.kabupaten;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'kabupaten',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.kabupaten');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for Provinsi ***/
        vm.selectedItem       = null;
        vm.searchText         = null;
        vm.querySearch        = KabupatenFactory.querySearchProvinsi;
        vm.simulateQuery      = false;
        vm.isDisabled         = false;
        vm.noCache            = true;
        vm.selectedItemChange = selectedItemChange;

        //////////////////
        function selectedItemChange(item) {
            if (angular.isDefined(item)){
                $log.info('Item changed to ' + item);
                vm.kabupaten.provinsi_id = item.id;
            }
        }
        /*** END - Autocomplete for Provinsi ***/
    }
})();
