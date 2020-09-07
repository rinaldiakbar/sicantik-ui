(function() {
    'use strict';

    angular
        .module('jenis-proses-module')
        .controller('JenisProsesViewController', JenisProsesViewController);

    /* @ngInject */
    function JenisProsesViewController($http, $state, EnvironmentConfig, $stateParams, JenisProsesFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.jenis_proses = {};

        JenisProsesFactory.getJenisProses(id).then(function (res) {
            angular.copy(res.data.data, vm.jenis_proses);
        });

        vm.cancelAction = JenisProsesFactory.cancelAction;
    }
})();
