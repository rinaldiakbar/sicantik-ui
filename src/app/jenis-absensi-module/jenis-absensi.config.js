(function() {
    'use strict';

    angular
        .module('jenis-absensi-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/jenis-absensi-module');
    }
})();
