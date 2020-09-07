(function() {
    'use strict';

    angular
        .module('jenis-usaha-module')
        .controller('JenisUsahaAddController', JenisUsahaAddController);

    /* @ngInject */
    function JenisUsahaAddController($http, $state, EnvironmentConfig, AppFactory, JenisUsahaFactory, $log) {
        var vm = this;
        vm.jenis_usaha = {
            kode: '',
            keterangan: '',
            bidang_usaha_id: null
        };

        vm.createAction = createAction;
        vm.cancelAction = JenisUsahaFactory.cancelAction;

        /*** BEGIN - Autocomplete for Kecamatan ***/
        vm.selectedItem       = null;
        vm.searchText         = null;
        vm.querySearch        = JenisUsahaFactory.querySearchBidangUsaha;
        vm.simulateQuery      = false;
        vm.isDisabled         = false;
        vm.noCache            = true;
        vm.selectedItemChange = selectedItemChangeBidangUsaha;

        //////////////////
        function selectedItemChangeBidangUsaha(item) {
            if (angular.isDefined(item)){
                $log.info('Item changed to ' + angular.toJson(item));
                vm.jenis_usaha.bidang_usaha_id = item.id;
            }
        }
        /*** END - Autocomplete for Kecamatan ***/

        function createAction() {
            var reqData = vm.jenis_usaha;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'jenis_usaha',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.jenis-usaha');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
