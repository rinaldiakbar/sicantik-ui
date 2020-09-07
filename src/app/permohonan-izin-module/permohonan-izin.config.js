(function() {
    'use strict';

    angular
        .module('permohonan-izin-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/permohonan-izin-module');

        $stateProvider
        .state('triangular.admin-default.permohonan-izin', {
            url: '/permohonan-izin',
            templateUrl: 'app/permohonan-izin-module/permohonan-izin-list.tmpl.html',
            controller: 'PermohonanIzinListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.permohonan-izin-add', {
            url: '/permohonan-izin/add',
            templateUrl: 'app/permohonan-izin-module/permohonan-izin-add.tmpl.html',
            controller: 'PermohonanIzinAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.permohonan-izin-edit', {
            url: '/permohonan-izin/edit/:permohonan_id',
            templateUrl: 'app/permohonan-izin-module/permohonan-izin-edit.tmpl.html',
            controller: 'PermohonanIzinEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.permohonan-izin-view', {
            url: '/permohonan-izin/view/:permohonan_id',
            templateUrl: 'app/permohonan-izin-module/permohonan-izin-view.tmpl.html',
            controller: 'PermohonanIzinViewController',
            controllerAs: 'vm'
        });
    }
})();
