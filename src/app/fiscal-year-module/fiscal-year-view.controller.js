(function() {
    'use strict';

    angular
        .module('fiscal-year-module')
        .controller('FiscalYearView', FiscalYearView);

    /* @ngInject */
    function FiscalYearView($http, $state, EnvironmentConfig, $stateParams, FiscalYearFactory) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.fiscal = {};
        vm.fiscal.ledger = [];

        FiscalYearFactory.getFiscalYear(id).then(function(res) {
            vm.fiscal = res.data.data;
        });

        vm.cancelAction = FiscalYearFactory.cancelAction;
    }
})();
