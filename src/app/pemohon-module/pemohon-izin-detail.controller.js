(function() {
    'use strict';

    angular
        .module('pemohon-module')
        .controller('PemohonIzinDetailController', PemohonIzinDetailController);

    /* @ngInject */
    function PemohonIzinDetailController($http, $state, $scope, $stateParams, $log, EnvironmentConfig, PemohonFactory, IzinFactory, PermohonanIzinFactory) {
        var vm = this;
        var id = $stateParams.izin_id;
        var keyId = $stateParams.key_id;

        vm.key_id = keyId;
        vm.izin = {};
        vm.backToPemohonView = PemohonFactory.backToPemohonView;

        IzinFactory.getIzin(id).then(function (res) {
            angular.copy(res.data.data, vm.izin);
            vm.key_id = vm.izin.key_id;
        });

        PermohonanIzinFactory.getGenderList().then(function(res) {
            vm.genderList = res.data.data.items;

            PermohonanIzinFactory.getJenisIdentitasList().then(function(res) {
                vm.jenisIdentitasList = res.data.data.items;
            });
        });
    }
})();
