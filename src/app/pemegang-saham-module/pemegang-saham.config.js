(function() {
    'use strict';

    angular
        .module('pemegang-saham-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/pemegang-saham-module');
    }
})();
