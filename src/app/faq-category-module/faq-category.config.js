(function() {
    'use strict';

    angular
        .module('faq-category-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/faq-category-module');

        $stateProvider
        .state('triangular.admin-default.faq-category', {
            url: '/faq-category',
            templateUrl: 'app/faq-category-module/faq-category-list.tmpl.html',
            controller: 'FaqCategoryListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-category-add', {
            url: '/faq-category/add',
            templateUrl: 'app/faq-category-module/faq-category-add.tmpl.html',
            controller: 'FaqCategoryAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-category-edit', {
            url: '/faq-category/edit/:id',
            templateUrl: 'app/faq-category-module/faq-category-edit.tmpl.html',
            controller: 'FaqCategoryEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-category-view', {
            url: '/faq-category/view/:id',
            templateUrl: 'app/faq-category-module/faq-category-view.tmpl.html',
            controller: 'FaqCategoryViewController',
            controllerAs: 'vm'
        });
    }
})();
