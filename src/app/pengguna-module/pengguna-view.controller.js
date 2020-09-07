(function() {
    'use strict';

    angular
        .module('pengguna-module')
        .controller('PenggunaViewController', PenggunaViewController);

    /* @ngInject */
    function PenggunaViewController($http, $state, EnvironmentConfig, $stateParams, PenggunaFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.pengguna = {};
        vm.unit = [];
        vm.jenis_izin = [];
        vm.jenis_proses = [];

        PenggunaFactory.getPengguna(id).then(function(res) {
            angular.copy(res.data.data, vm.pengguna);
            vm.unit = res.data.data.unit;
            vm.jenis_izin = res.data.data.jenis_izin;
            vm.jenis_proses = res.data.data.jenis_proses;
        });

        vm.cancelAction = PenggunaFactory.cancelAction;
    }
})();
