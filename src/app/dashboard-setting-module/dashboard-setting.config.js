(function () {
    'use strict';

    angular
        .module('dashboard-setting-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/dashboard-setting-module');

        $stateProvider
            .state('triangular.admin-default.dashboard-setting', {
                url: '/dashboard-setting',
                templateUrl: 'app/dashboard-setting-module/dashboard-setting-list.tmpl.html',
                controller: 'DashboardSettingListController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.dashboard-setting-add', {
                url: '/dashboard-setting/add',
                templateUrl: 'app/dashboard-setting-module/dashboard-setting-add.tmpl.html',
                controller: 'DashboardSettingAddController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.dashboard-setting-edit', {
                url: '/dashboard-setting/edit/:id',
                templateUrl: 'app/dashboard-setting-module/dashboard-setting-edit.tmpl.html',
                controller: 'DashboardSettingEditController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.dashboard-setting-view', {
                url: '/dashboard-setting/view/:id',
                templateUrl: 'app/dashboard-setting-module/dashboard-setting-view.tmpl.html',
                controller: 'DashboardSettingViewController',
                controllerAs: 'vm'
            });
    }
})();
