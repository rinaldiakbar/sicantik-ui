(function() {
    'use strict';

    angular
        .module('jenis-izin-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/jenis-izin-module');

        $stateProvider
        .state('triangular.admin-default.jenis-izin', {
            url: '/jenis-izin',
            templateUrl: 'app/jenis-izin-module/jenis-izin-list.tmpl.html',
            controller: 'JenisIzinListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.jenis-izin-add', {
            url: '/jenis-izin/add',
            templateUrl: 'app/jenis-izin-module/jenis-izin-add.tmpl.html',
            controller: 'JenisIzinAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.jenis-izin-edit', {
            url: '/jenis-izin/edit/:id',
            templateUrl: 'app/jenis-izin-module/jenis-izin-edit.tmpl.html',
            controller: 'JenisIzinEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.jenis-izin-view', {
            url: '/jenis-izin/view/:id',
            templateUrl: 'app/jenis-izin-module/jenis-izin-view.tmpl.html',
            controller: 'JenisIzinViewController',
            controllerAs: 'vm'
        });
    }
})();
