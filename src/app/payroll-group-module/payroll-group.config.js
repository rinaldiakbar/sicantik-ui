(function() {
    'use strict';

    angular
        .module('payroll-group-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/payroll-group-module');
    }
})();
