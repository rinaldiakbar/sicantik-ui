(function() {
    'use strict';

    angular
        .module('aksi-pegawai-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/aksi-pegawai-module');
    }
})();
