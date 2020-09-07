(function () {
    'use strict';

    angular
        .module('jenis-dokumen-module')
        .controller('JenisDokumenViewController', JenisDokumenViewController);

    /* @ngInject */
    function JenisDokumenViewController($scope, $stateParams, ElementConfig, JenisDokumenFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.jenis_dokumen = {};

        JenisDokumenFactory.getJenisDokumen(id).then(function (res) {
            angular.copy(res.data.data, vm.jenis_dokumen);
        });

        vm.cancelAction = JenisDokumenFactory.cancelAction;
    }
})();
