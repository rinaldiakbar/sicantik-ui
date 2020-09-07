(function() {
    'use strict';

    angular
        .module('alur-proses-module')
        .controller('AlurProsesViewController', AlurProsesViewController);

    /* @ngInject */
    function AlurProsesViewController($http, $state, EnvironmentConfig, $stateParams, AlurProsesFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.alur_proses = {};
        vm.alur_proses.daftar_proses = [];

        AlurProsesFactory.getAlurProses(id).then(function (res) {
            angular.copy(res.data.data, vm.alur_proses);
        });

        vm.cancelAction = AlurProsesFactory.cancelAction;
    }
})();
