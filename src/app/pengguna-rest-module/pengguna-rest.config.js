(function() {
    'use strict';

    angular
        .module('pengguna-rest-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/pengguna-rest-module');

        $stateProvider
        .state('triangular.admin-default.pengguna-rest', {
            url: '/pengguna-rest',
            templateUrl: 'app/pengguna-rest-module/pengguna-rest-list.tmpl.html',
            controller: 'PenggunaRestListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengguna-rest-add', {
            url: '/pengguna-rest/add',
            templateUrl: 'app/pengguna-rest-module/pengguna-rest-add.tmpl.html',
            controller: 'PenggunaRestAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengguna-rest-edit', {
            url: '/pengguna-rest/edit/:id',
            templateUrl: 'app/pengguna-rest-module/pengguna-rest-edit.tmpl.html',
            controller: 'PenggunaRestEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengguna-rest-view', {
            url: '/pengguna-rest/view/:id',
            templateUrl: 'app/pengguna-rest-module/pengguna-rest-view.tmpl.html',
            controller: 'PenggunaRestViewController',
            controllerAs: 'vm'
        });
    }
})();
