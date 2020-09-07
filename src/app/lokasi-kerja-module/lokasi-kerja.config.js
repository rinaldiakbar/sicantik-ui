(function() {
    'use strict';

    angular
        .module('lokasi-kerja-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/lokasi-kerja-module');
    }
})();
