(function() {
    'use strict';

    angular
        .module('pemohon-register-module')
        .controller('PemohonRegisterView', PemohonRegisterView);

    /* @ngInject */
    function PemohonRegisterView(
        $state, $scope, $stateParams, $mdDialog, $mdMedia, $log, 
        ElementConfig, PemohonRegisterFactory, PemohonFactory, PermohonanIzinFactory
    ) {
        var vm = this;
        vm.key_id = $stateParams.key_id;

        vm.pemohon = {};
        vm.cancelAction = PemohonRegisterFactory.cancelAction;

        PemohonFactory.getPemohon(vm.key_id).then(function (res) {
            angular.copy(res.data.data, vm.pemohon);

            PermohonanIzinFactory.getGenderList().then(function (res) {
                vm.genderList = res.data.data.items;

                PermohonanIzinFactory.getJenisIdentitasList().then(function (res) {
                    vm.jenisIdentitasList = res.data.data.items
                });
            });
        });
    }
})();