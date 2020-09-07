(function() {
    'use strict';

    angular
        .module('kecamatan-module')
        .controller('KecamatanAddController', KecamatanAddController);

    /* @ngInject */
    function KecamatanAddController($http, $state, EnvironmentConfig, $log, AppFactory, KecamatanFactory) {
        var vm = this;
        vm.kecamatan = {
            kode_daerah: '',
            nama_daerah: '',
            kabupaten_id: 0
        };

        vm.createAction = createAction;
        vm.cancelAction = KecamatanFactory.cancelAction;

        function createAction() {
            var reqData = vm.kecamatan;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'kecamatan',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.kecamatan');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for Kabupaten ***/
        vm.selectedItem       = null;
        vm.searchText         = null;
        vm.querySearch        = KecamatanFactory.querySearchKabupaten;
        vm.simulateQuery      = false;
        vm.isDisabled         = false;
        vm.noCache            = true;
        vm.selectedItemChange = selectedItemChange;

        //////////////////
        function selectedItemChange(item) {
            if (angular.isDefined(item)){
                $log.info('Item changed to ' + item);
                vm.kecamatan.kabupaten_id = item.id;
            }
        }
        /*** END - Autocomplete for Kabupaten ***/
    }
})();
