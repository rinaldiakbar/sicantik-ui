(function() {
    'use strict';

    angular
        .module('alur-proses-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/alur-proses-module');

        $stateProvider
        .state('triangular.admin-default.alur-proses', {
            url: '/alur-proses',
            templateUrl: 'app/alur-proses-module/alur-proses-list.tmpl.html',
            controller: 'AlurProsesListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.alur-proses-add', {
            url: '/alur-proses/add',
            templateUrl: 'app/alur-proses-module/alur-proses-add.tmpl.html',
            controller: 'AlurProsesAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.alur-proses-edit', {
            url: '/alur-proses/edit/:id',
            templateUrl: 'app/alur-proses-module/alur-proses-edit.tmpl.html',
            controller: 'AlurProsesEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.alur-proses-view', {
            url: '/alur-proses/view/:id',
            templateUrl: 'app/alur-proses-module/alur-proses-view.tmpl.html',
            controller: 'AlurProsesViewController',
            controllerAs: 'vm'
        });
    }
})();
