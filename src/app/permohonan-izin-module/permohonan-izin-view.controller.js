(function() {
    'use strict';

    angular
        .module('permohonan-izin-module')
        .controller('PermohonanIzinViewController', PermohonanIzinViewController);

    /* @ngInject */
    function PermohonanIzinViewController($http, $state, EnvironmentConfig, $stateParams, PermohonanIzinFactory) {
        var vm = this;
        var id = $stateParams.permohonan_id;
        vm.permohonan_izin = {};

        PermohonanIzinFactory.getPermohonanIzin(id).then(function (res) {
            angular.copy(res.data.data, vm.permohonan_izin);
        });

        PermohonanIzinFactory.getJenisPermohonanList().then(function(res) {
            vm.jenisPermohonanList = res.data.data.items;

            PermohonanIzinFactory.getGenderList().then(function(res) {
                vm.genderList = res.data.data.items;

                PermohonanIzinFactory.getJenisIdentitasList().then(function(res) {
                    vm.jenisIdentitasList = res.data.data.items;

                    PermohonanIzinFactory.getTipePemohonList().then(function(res) {
                        vm.tipePemohonList = res.data.data.items;

                        PermohonanIzinFactory.getJenisProyekList().then(function(res) {
                            vm.jenisProyekList = res.data.data.items;
                        });
                    });
                });
            });
        });

        vm.cancelAction = PermohonanIzinFactory.cancelAction;
    }
})();
