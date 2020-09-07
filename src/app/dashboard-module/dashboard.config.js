(function () {
    'use strict';

    angular
        .module('dashboard-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider, triMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/dashboard-module');

        $stateProvider
            .state('triangular.admin-default.home', {
                url: '/home',
                templateUrl: 'app/dashboard-module/dashboard-list.tmpl.html',
                controller: 'DashboardListController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.dashboard', {
                url: '/dashboard/:page_id',
                templateUrl: 'app/dashboard-module/dashboard-analytics.tmpl.html',
                controller: 'DashboardAnalyticsController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu({
            name: 'Home',
            icon: 'zmdi zmdi-grade',
            type: 'link',
            priority: 0.0,
            state: 'triangular.admin-default.home'
        });
    }
})();
