(function() {
    'use strict';

    angular
        .module('jenis-proses-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/jenis-proses-module');

        $stateProvider
        .state('triangular.admin-default.jenis-proses', {
            url: '/jenis-proses',
            templateUrl: 'app/jenis-proses-module/jenis-proses-list.tmpl.html',
            controller: 'JenisProsesListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.jenis-proses-add', {
            url: '/jenis-proses/add',
            templateUrl: 'app/jenis-proses-module/jenis-proses-add.tmpl.html',
            controller: 'JenisProsesAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.jenis-proses-edit', {
            url: '/jenis-proses/edit/:id',
            templateUrl: 'app/jenis-proses-module/jenis-proses-edit.tmpl.html',
            controller: 'JenisProsesEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.jenis-proses-view', {
            url: '/jenis-proses/view/:id',
            templateUrl: 'app/jenis-proses-module/jenis-proses-view.tmpl.html',
            controller: 'JenisProsesViewController',
            controllerAs: 'vm'
        });
    }
})();
