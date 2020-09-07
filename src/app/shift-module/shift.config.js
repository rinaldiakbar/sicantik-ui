(function() {
    'use strict';

    angular
        .module('shift-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/shift-module');
    }
})();
