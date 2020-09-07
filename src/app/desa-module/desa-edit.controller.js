(function() {
    'use strict';

    angular
        .module('desa-module')
        .controller('DesaEditController', DesaEditController);

    /* @ngInject */
    function DesaEditController($http, $state, EnvironmentConfig, $stateParams, $log, $scope, AppFactory, DesaFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.desa = {
            id: id,
            kode_daerah: '',
            nama_daerah: '',
            kecamatan_id: 0
        };

        DesaFactory.getDesa(id).then(function (res) {
            angular.copy(res.data.data, vm.desa);
            vm.searchText = res.data.data.kecamatan.nama_daerah;
        });

        vm.updateAction = updateAction;
        vm.cancelAction = DesaFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'kode_daerah' : vm.desa.kode_daerah,
                'nama_daerah' : vm.desa.nama_daerah,
                'kecamatan_id' : vm.desa.kecamatan_id
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'desa/' + id,
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

    }
})();
