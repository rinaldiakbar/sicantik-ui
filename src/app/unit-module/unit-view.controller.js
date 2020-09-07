(function() {
    'use strict';

    angular
        .module('unit-module')
        .controller('UnitViewController', UnitViewController);

    /* @ngInject */
    function UnitViewController($stateParams, AppFactory, UnitFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.unit = {};

        UnitFactory.getUnit(id).then(function(res) {
            angular.copy(res.data.data, vm.unit);
        }, function(err) {
            if (err.message) {
                AppFactory.showToast(err.message, 'error', err.errors);
            }
        });

        vm.cancelAction = UnitFactory.cancelAction;
    }
})();