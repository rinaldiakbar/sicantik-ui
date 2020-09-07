(function() {
    'use strict';

    angular
        .module('pegawai-module')
        .controller('PegawaiViewController', PegawaiViewController);

    /* @ngInject */
    function PegawaiViewController($http, $state, EnvironmentConfig, $stateParams, PegawaiFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.pegawai = {};

        PegawaiFactory.getPegawai(id).then(function (res){
            angular.copy(res.data.data, vm.pegawai);
        });

        vm.cancelAction = PegawaiFactory.cancelAction;
    }
})();
