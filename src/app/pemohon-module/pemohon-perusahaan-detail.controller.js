(function() {
    'use strict';

    angular
        .module('pemohon-module')
        .controller('PemohonPerusahaanDetailController', PemohonPerusahaanDetailController);

    /* @ngInject */
    function PemohonPerusahaanDetailController(
        $http, $state, $scope, $stateParams, $log, 
        EnvironmentConfig, PemohonFactory, PerusahaanFactory
    ) {
        var vm = this;
        var id = $stateParams.perusahaan_id;
        var keyId = $stateParams.key_id;

        vm.key_id = keyId;
        vm.perusahaan = {};
        vm.backToPemohonView = PemohonFactory.backToPemohonView;
        
        PerusahaanFactory.getPerusahaan(id).then(function (res) {
            angular.copy(res.data.data, vm.perusahaan);
            
            if (angular.isDefined(vm.perusahaan.key_id)) {
                vm.key_id = vm.perusahaan.key_id;
            }
        });
    }
})();
