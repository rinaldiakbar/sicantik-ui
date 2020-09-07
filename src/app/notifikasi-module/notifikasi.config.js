(function() {
    'use strict';

    angular
        .module('notifikasi-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/notifikasi-module');

        $stateProvider
        .state('triangular.admin-default.notifikasi', {
            url: '/notifikasi',
            templateUrl: 'app/notifikasi-module/notifikasi-list.tmpl.html',
            controller: 'NotifikasiListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.notifikasi-edit', {
            url: '/notifikasi/edit/:id',
            templateUrl: 'app/notifikasi-module/notifikasi-edit.tmpl.html',
            controller: 'NotifikasiEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.notifikasi-view', {
            url: '/notifikasi/view/:id',
            templateUrl: 'app/notifikasi-module/notifikasi-view.tmpl.html',
            controller: 'NotifikasiViewController',
            controllerAs: 'vm'
        });
    }
})();
