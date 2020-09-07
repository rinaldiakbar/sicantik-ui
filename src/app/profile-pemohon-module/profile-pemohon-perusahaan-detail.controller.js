(function() {
    'use strict';

    angular
        .module('profile-pemohon-module')
        .controller('ProfilePemohonPerusahaanDetail', ProfilePemohonPerusahaanDetail);

    /* @ngInject */
    function ProfilePemohonPerusahaanDetail(
        $http, $state, $scope, $stateParams, $log, 
        EnvironmentConfig, ProfilePemohonFactory, PerusahaanFactory
    ) {
        var vm = this;
        var id = $stateParams.perusahaan_id;

        vm.perusahaan = {};
        vm.backToProfilePemohonView = ProfilePemohonFactory.backToProfilePemohonView;
        
        PerusahaanFactory.getPerusahaan(id).then(function (res) {
            angular.copy(res.data.data, vm.perusahaan);
        });
    }
})();
