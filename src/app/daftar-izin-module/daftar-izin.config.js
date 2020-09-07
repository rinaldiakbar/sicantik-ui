(function() {
    'use strict';

    angular
        .module('daftar-izin-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/daftar-izin-module');

        $stateProvider
        .state('triangular.admin-default.daftar-izin', {
            url: '/daftar-izin',
            templateUrl: 'app/daftar-izin-module/daftar-izin-list.tmpl.html',
            controller: 'DaftarIzinListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.daftar-izin-view', {
            url: '/daftar-izin/view/:permohonan_id',
            templateUrl: 'app/daftar-izin-module/daftar-izin-view.tmpl.html',
            controller: 'DaftarIzinViewController',
            controllerAs: 'vm'
        });
    }
})();
