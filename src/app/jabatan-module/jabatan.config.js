(function() {
    'use strict';

    angular
        .module('jabatan-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('app/unit-module');
    }
})();
