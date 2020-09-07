(function() {
    'use strict';

    angular
        .module('desa-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/desa-module');

        $stateProvider
        .state('triangular.admin-default.desa', {
            url: '/desa',
            templateUrl: 'app/desa-module/desa-list.tmpl.html',
            controller: 'DesaListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.desa-add', {
            url: '/desa/add',
            templateUrl: 'app/desa-module/desa-add.tmpl.html',
            controller: 'DesaAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.desa-edit', {
            url: '/desa/edit/:id',
            templateUrl: 'app/desa-module/desa-edit.tmpl.html',
            controller: 'DesaEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.desa-view', {
            url: '/desa/view/:id',
            templateUrl: 'app/desa-module/desa-view.tmpl.html',
            controller: 'DesaViewController',
            controllerAs: 'vm'
        });
    }
})();
