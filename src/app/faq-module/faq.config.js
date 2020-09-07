(function() {
    'use strict';

    angular
        .module('faq-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/faq-module');

        $stateProvider
        .state('triangular.admin-default.faq', {
            url: '/faq',
            templateUrl: 'app/faq-module/faq-list.tmpl.html',
            controller: 'FaqListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-search', {
            url: '/faq/search/:key_id',
            templateUrl: 'app/faq-module/faq-search.tmpl.html',
            controller: 'FaqSearchController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-search-all', {
            url: '/faq/search-all',
            templateUrl: 'app/faq-module/faq-search-all.tmpl.html',
            controller: 'FaqSearchAllController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-view', {
            url: '/faq/view/:id',
            templateUrl: 'app/faq-module/faq-view.tmpl.html',
            controller: 'FaqViewController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-detail', {
            url: '/faq/detail/:id',
            templateUrl: 'app/faq-module/faq-detail.tmpl.html',
            controller: 'FaqViewController',
            controllerAs: 'vm'
        });
    }
})();
