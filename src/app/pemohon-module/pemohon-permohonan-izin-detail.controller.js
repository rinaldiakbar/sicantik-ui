(function() {
    'use strict';

    angular
        .module('pemohon-module')
        .controller('PemohonPermohonanIzinDetailController', PemohonPermohonanIzinDetailController);

    /* @ngInject */
    function PemohonPermohonanIzinDetailController($http, $state, $scope, $stateParams, $log, EnvironmentConfig, PemohonFactory, PermohonanIzinFactory) {
        var vm = this;
        var id = $stateParams.permohonan_id;
        var keyId = $stateParams.key_id;

        vm.key_id = keyId;
        vm.permohonan_izin = {};
        vm.backToPemohonView = PemohonFactory.backToPemohonView;

        PermohonanIzinFactory.getPermohonanIzin(id).then(function (res) {
            angular.copy(res.data.data, vm.permohonan_izin);
            vm.key_id = vm.permohonan_izin.pemohon_id;
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
    }
})();
