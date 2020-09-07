(function() {
    'use strict';

    angular
        .module('provinsi-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/provinsi-module');

        $stateProvider
        .state('triangular.admin-default.provinsi', {
            url: '/provinsi',
            templateUrl: 'app/provinsi-module/provinsi-list.tmpl.html',
            controller: 'ProvinsiListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.provinsi-add', {
            url: '/provinsi/add',
            templateUrl: 'app/provinsi-module/provinsi-add.tmpl.html',
            controller: 'ProvinsiAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.provinsi-edit', {
            url: '/provinsi/edit/:id',
            templateUrl: 'app/provinsi-module/provinsi-edit.tmpl.html',
            controller: 'ProvinsiEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.provinsi-view', {
            url: '/provinsi/view/:id',
            templateUrl: 'app/provinsi-module/provinsi-view.tmpl.html',
            controller: 'ProvinsiViewController',
            controllerAs: 'vm'
        });
    }
})();
