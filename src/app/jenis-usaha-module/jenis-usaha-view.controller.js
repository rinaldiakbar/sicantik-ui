(function() {
    'use strict';

    angular
        .module('jenis-usaha-module')
        .controller('JenisUsahaViewController', JenisUsahaViewController);

    /* @ngInject */
    function JenisUsahaViewController($scope, $stateParams, JenisUsahaFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.jenisusaha = {};

        JenisUsahaFactory.getJenisUsaha(id).then(function(res) {
            angular.copy(res.data.data, vm.jenisusaha);
        });

        vm.cancelAction = JenisUsahaFactory.cancelAction;
    }
})();