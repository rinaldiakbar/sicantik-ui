(function() {
    'use strict';

    angular
        .module('desa-module')
        .controller('DesaViewController', DesaViewController);

    /* @ngInject */
    function DesaViewController($stateParams, DesaFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.desa = {};

        DesaFactory.getDesa(id).then(function (res) {
            angular.copy(res.data.data, vm.desa);
        });

        vm.cancelAction = DesaFactory.cancelAction;
    }
})();
