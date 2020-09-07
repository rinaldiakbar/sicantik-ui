(function () {
    'use strict';

    angular
        .module('form-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/form-module');

        /*We have similar route to make key_id optional. And the link will work with or without "/"*/
        $stateProvider
            .state('triangular.admin-default.form-add', {
                url: '/form/add/:form_id/:key_id/:proses_permohonan_id?',
                templateUrl: 'app/form-module/form-add.tmpl.html',
                controller: 'FormAddController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-add-noproses', {
                url: '/form/add/:form_id/:key_id',
                templateUrl: 'app/form-module/form-add.tmpl.html',
                controller: 'FormAddController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-add-nokey', {
                url: '/form/add/:form_id',
                templateUrl: 'app/form-module/form-add.tmpl.html',
                controller: 'FormAddController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-render', {
                url: '/form/render/:form_id/:key_id/:proses_permohonan_id?',
                templateUrl: 'app/form-module/form-render.tmpl.html',
                controller: 'FormRenderController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-render-noproses', {
                url: '/form/render/:form_id/:key_id',
                templateUrl: 'app/form-module/form-render.tmpl.html',
                controller: 'FormRenderController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-render-nokey', {
                url: '/form/render/:form_id',
                templateUrl: 'app/form-module/form-render.tmpl.html',
                controller: 'FormRenderController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-view', {
                url: '/form/view/:form_id/:key_id/:proses_permohonan_id?',
                templateUrl: 'app/form-module/form-view.tmpl.html',
                controller: 'FormViewController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-view-noproses', {
                url: '/form/view/:form_id/:key_id',
                templateUrl: 'app/form-module/form-view.tmpl.html',
                controller: 'FormViewController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-list', {
                url: '/form/list/:form_id',
                templateUrl: 'app/form-module/form-list.tmpl.html',
                controller: 'FormListController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-report', {
                url: '/form/report/:form_id',
                templateUrl: 'app/form-module/form-report.tmpl.html',
                controller: 'FormReportController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.form-report-grid', {
                url: '/form/report-grid/:form_id',
                templateUrl: 'app/form-module/form-report-grid.tmpl.html',
                controller: 'FormReportGridController',
                controllerAs: 'vm'
            });
    }
})();