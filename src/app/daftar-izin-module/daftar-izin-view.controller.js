(function() {
    'use strict';

    angular
        .module('daftar-izin-module')
        .controller('DaftarIzinViewController', DaftarIzinViewController);

    /* @ngInject */
    function DaftarIzinViewController($http, $state, EnvironmentConfig, $stateParams, DaftarIzinFactory, PermohonanIzinFactory) {
        var vm = this;
        var id = $stateParams.permohonan_id;
        vm.permohonan_izin = {};

        DaftarIzinFactory.getDaftarIzin(id).then(function (res) {
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

        vm.cancelAction = DaftarIzinFactory.cancelAction;
    }
})();
