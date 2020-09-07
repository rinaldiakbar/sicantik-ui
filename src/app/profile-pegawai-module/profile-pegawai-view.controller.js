(function() {
    'use strict';

    angular
        .module('profile-pegawai-module')
        .controller('ProfilePegawaiViewController', ProfilePegawaiViewController);

    /* @ngInject */
    function ProfilePegawaiViewController(
      $http, $state, EnvironmentConfig, $stateParams, ProfilePegawaiFactory
    ) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.pegawai = {};
        vm.pegawai.c_pegawai = {};
        vm.pegawai.c_pegawai.c_pegawai_atribut = [];

        ProfilePegawaiFactory.getProfilePegawai(id).then(function(res) {
            vm.pegawai = res.data.data;
        });

        ProfilePegawaiFactory.getGenderList().then(function(res) {
            vm.genderList = res.data.data.items;
        });

        ProfilePegawaiFactory.getAgamaList().then(function(res) {
            vm.agamaList = res.data.data.items;
        });

        ProfilePegawaiFactory.getBloodList().then(function(res) {
            vm.bloodList = res.data.data.items;
        });

        vm.cancelAction = ProfilePegawaiFactory.cancelAction;
    }
})();
