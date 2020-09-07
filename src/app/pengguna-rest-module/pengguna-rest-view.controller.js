(function() {
    'use strict';

    angular
        .module('pengguna-rest-module')
        .controller('PenggunaRestViewController', PenggunaRestViewController);

    /* @ngInject */
    function PenggunaRestViewController($http, $state, EnvironmentConfig, $stateParams, PenggunaRestFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.pengguna = {};
        vm.unit = [];
        vm.jenis_izin = [];
        vm.jenis_proses = [];

        PenggunaRestFactory.getPengguna(id).then(function(res) {
            angular.copy(res.data.data, vm.pengguna);
            vm.pengguna.is_active = vm.pengguna.is_active === 1 ? true : false;
            vm.unit = res.data.data.unit;
        });

        vm.cancelAction = PenggunaRestFactory.cancelAction;
    }
})();
