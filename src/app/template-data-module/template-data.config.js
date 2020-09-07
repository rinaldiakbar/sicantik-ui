(function() {
    'use strict';

    angular
        .module('template-data-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/template-data-module');

        $stateProvider
        .state('triangular.admin-default.template-data', {
            url: '/template-data',
            templateUrl: 'app/template-data-module/template-data-list.tmpl.html',
            controller: 'TemplateDataListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.template-data-add', {
            url: '/template-data/add',
            templateUrl: 'app/template-data-module/template-data-add.tmpl.html',
            controller: 'TemplateDataAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.template-data-edit', {
            url: '/template-data/edit/:id',
            templateUrl: 'app/template-data-module/template-data-edit.tmpl.html',
            controller: 'TemplateDataEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.template-data-view', {
            url: '/template-data/view/:id',
            templateUrl: 'app/template-data-module/template-data-view.tmpl.html',
            controller: 'TemplateDataViewController',
            controllerAs: 'vm'
        })
        ;
    }
})();
