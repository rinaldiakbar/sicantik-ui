(function() {
    'use strict';

    angular
        .module('form-assessment-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/form-assessment-module');
        $stateProvider
        .state('triangular.admin-default.form-assessment', {
            url: '/form-assessment',
            templateUrl: 'app/form-assessment-module/form-assessment-list.tmpl.html',
            controller: 'FormAssessmentList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.form-assessment-add', {
            url: '/form-assessment/add',
            templateUrl: 'app/form-assessment-module/form-assessment-add.tmpl.html',
            controller: 'FormAssessmentAdd',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.form-assessment-edit', {
            url: '/form-assessment/edit/:id',
            templateUrl: 'app/form-assessment-module/form-assessment-edit.tmpl.html',
            controller: 'FormAssessmentEdit',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.form-assessment-assess', {
            url: '/form-assessment/assess/:id',
            templateUrl: 'app/form-assessment-module/form-assessment-assess.tmpl.html',
            controller: 'FormAssessmentAssess',
            controllerAs: 'vm'
        });
    }
})();
