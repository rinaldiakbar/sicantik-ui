(function() {
    'use strict';

    angular
        .module('posisi-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/posisi-module');
    }
})();
