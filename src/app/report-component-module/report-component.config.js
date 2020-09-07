(function() {
    'use strict';

    angular
        .module('report-component-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/report-component-module');

        $stateProvider
        .state('triangular.admin-default.report-component', {
            url: '/report-component',
            templateUrl: 'app/report-component-module/report-component-list.tmpl.html',
            controller: 'ReportComponentListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.report-component-edit', {
            url: '/report-component/edit/:id',
            templateUrl: 'app/report-component-module/report-component-edit.tmpl.html',
            controller: 'ReportComponentEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.report-component-view', {
            url: '/report-component/view/:id',
            templateUrl: 'app/report-component-module/report-component-view.tmpl.html',
            controller: 'ReportComponentViewController',
            controllerAs: 'vm'
        });
    }
})();
