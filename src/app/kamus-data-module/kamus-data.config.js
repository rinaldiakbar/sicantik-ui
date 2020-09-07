(function() {
    'use strict';

    angular
        .module('kamus-data-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/kamus-data-module');

        $stateProvider
        .state('triangular.admin-default.kamus-data', {
            url: '/kamus-data',
            templateUrl: 'app/kamus-data-module/kamus-data-list.tmpl.html',
            controller: 'DatatabelListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kamus-data-add', {
            url: '/kamus-data/add',
            templateUrl: 'app/kamus-data-module/kamus-data-add.tmpl.html',
            controller: 'DatatabelAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kamus-data-edit', {
            url: '/kamus-data/edit/:id',
            templateUrl: 'app/kamus-data-module/kamus-data-edit.tmpl.html',
            controller: 'DatatabelEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kamus-data-view', {
            url: '/kamus-data/view/:id',
            templateUrl: 'app/kamus-data-module/kamus-data-view.tmpl.html',
            controller: 'DatatabelViewController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kamus-data-records', {
            url: '/kamus-data/records/:id',
            templateUrl: 'app/kamus-data-module/kamus-data-records.tmpl.html',
            controller: 'DatatabelRecordsController',
            controllerAs: 'vm'
        })
        ;
    }
})();
