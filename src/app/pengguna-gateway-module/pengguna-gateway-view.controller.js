(function() {
    'use strict';

    angular
        .module('pengguna-gateway-module')
        .controller('PenggunaGatewayViewController', PenggunaGatewayViewController);

    /* @ngInject */
    function PenggunaGatewayViewController($http, $state, EnvironmentConfig, $stateParams, PenggunaGatewayFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.pengguna = {};
        vm.unit = [];
        vm.jenis_izin = [];
        vm.jenis_proses = [];

        PenggunaGatewayFactory.getPengguna(id).then(function(res) {
            angular.copy(res.data.data, vm.pengguna);
            vm.pengguna.is_active = vm.pengguna.is_active === 1 ? true : false;
            vm.unit = res.data.data.unit;
        });

        vm.cancelAction = PenggunaGatewayFactory.cancelAction;
    }
})();
