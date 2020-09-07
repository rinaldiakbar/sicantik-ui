(function () {
    'use strict';

    angular
        .module('template-form-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/template-form-module');

        $stateProvider
            .state('triangular.admin-default.template-form', {
                url: '/template-form',
                templateUrl: 'app/template-form-module/template-form-list.tmpl.html',
                controller: 'TemplateFormListController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.template-form-add', {
                url: '/template-form/add',
                templateUrl: 'app/template-form-module/template-form-add.tmpl.html',
                controller: 'TemplateFormAddController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.template-form-edit', {
                url: '/template-form/edit/:form_id',
                templateUrl: 'app/template-form-module/template-form-edit.tmpl.html',
                controller: 'TemplateFormEditController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.template-form-preview', {
                url: '/template-form/preview/:form_id',
                templateUrl: 'app/template-form-module/template-form-preview.tmpl.html',
                controller: 'TemplateFormPreviewController',
                controllerAs: 'vm'
            });
    }
})();
