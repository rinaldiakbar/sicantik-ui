(function() {
    'use strict';

    angular
        .module('status-pegawai-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/status-pegawai-module');
    }
})();
