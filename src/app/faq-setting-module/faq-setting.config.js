(function() {
    'use strict';

    angular
        .module('faq-setting-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/faq-setting-module');

        $stateProvider
        .state('triangular.admin-default.faq-setting', {
            url: '/faq-setting',
            templateUrl: 'app/faq-setting-module/faq-setting-list.tmpl.html',
            controller: 'FaqSettingListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-setting-add', {
            url: '/faq-setting/add',
            templateUrl: 'app/faq-setting-module/faq-setting-add.tmpl.html',
            controller: 'FaqSettingAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-setting-edit', {
            url: '/faq-setting/edit/:id',
            templateUrl: 'app/faq-setting-module/faq-setting-edit.tmpl.html',
            controller: 'FaqSettingEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.faq-setting-view', {
            url: '/faq-setting/view/:id',
            templateUrl: 'app/faq-setting-module/faq-setting-view.tmpl.html',
            controller: 'FaqSettingViewController',
            controllerAs: 'vm'
        });
    }
})();
