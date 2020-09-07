(function() {
    'use strict';

    angular
        .module('profile-module')
        .controller('ProfileView', ProfileView);

    /* @ngInject */
    function ProfileView($http, $state, EnvironmentConfig, $stateParams, profileFactory) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.pegawai_atribut = [];

        profileFactory.getProfilePegawai(id).then(function(res) {
            vm.profile = res.data.data;
        });

        profileFactory.getGenderList().then(function(res) {
            vm.genderList = res.data.data.items;
        });

        profileFactory.getAgamaList().then(function(res) {
            vm.agamaList = res.data.data.items;
        });

        profileFactory.getBloodList().then(function(res) {
            vm.bloodList = res.data.data.items;
        });

        vm.cancelAction = profileFactory.cancelAction;
    }
})();
