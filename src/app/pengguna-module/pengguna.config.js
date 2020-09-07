(function() {
    'use strict';

    angular
        .module('pengguna-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/pengguna-module');

        $stateProvider
        .state('triangular.admin-default.pengguna', {
            url: '/pengguna',
            templateUrl: 'app/pengguna-module/pengguna-list.tmpl.html',
            controller: 'PenggunaListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengguna-add', {
            url: '/pengguna/add',
            templateUrl: 'app/pengguna-module/pengguna-add.tmpl.html',
            controller: 'PenggunaAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengguna-edit', {
            url: '/pengguna/edit/:id',
            templateUrl: 'app/pengguna-module/pengguna-edit.tmpl.html',
            controller: 'PenggunaEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengguna-view', {
            url: '/pengguna/view/:id',
            templateUrl: 'app/pengguna-module/pengguna-view.tmpl.html',
            controller: 'PenggunaViewController',
            controllerAs: 'vm'
        });
    }
})();
