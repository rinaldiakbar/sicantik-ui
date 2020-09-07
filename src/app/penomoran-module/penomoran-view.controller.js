(function() {
    'use strict';

    angular
        .module('penomoran-module')
        .controller('PenomoranViewController', PenomoranViewController);

    /* @ngInject */
    function PenomoranViewController($scope, $stateParams, PenomoranFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.penomoran = {};

        PenomoranFactory.getPenomoran(id).then(function(res) {
            angular.copy(res.data.data, vm.penomoran);
        });

        vm.cancelAction = PenomoranFactory.cancelAction;
    }
})();
