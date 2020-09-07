(function() {
    'use strict';

    angular
        .module('fiscal-year-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/fiscal-year-module');

        $stateProvider
        .state('triangular.admin-default.fiscal-year', {
            url: '/fiscal-year',
            templateUrl: 'app/fiscal-year-module/fiscal-year-list.tmpl.html',
            // set the controller to load for this page
            controller: 'FiscalYearList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.fiscal-year-add', {
            url: '/fiscal-year-add',
            templateUrl: 'app/fiscal-year-module/fiscal-year-add.tmpl.html',
            // set the controller to load for this page
            controller: 'FiscalYearAdd',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.fiscal-year-edit', {
            url: '/fiscal-year-edit/:id',
            templateUrl: 'app/fiscal-year-module/fiscal-year-edit.tmpl.html',
            // set the controller to load for this page
            controller: 'FiscalYearEdit',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.fiscal-year-view', {
            url: '/fiscal-year-view/:id',
            templateUrl: 'app/fiscal-year-module/fiscal-year-view.tmpl.html',
            // set the controller to load for this page
            controller: 'FiscalYearView',
            controllerAs: 'vm'
        });
    }
})();
