(function () {
    'use strict';

    angular
        .module('jenis-dokumen-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/jenis-dokumen-module');

        $stateProvider
            .state('triangular.admin-default.jenis-dokumen', {
                url: '/jenis-dokumen',
                templateUrl: 'app/jenis-dokumen-module/jenis-dokumen-list.tmpl.html',
                controller: 'JenisDokumenListController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.jenis-dokumen-add', {
                url: '/jenis-dokumen/add',
                templateUrl: 'app/jenis-dokumen-module/jenis-dokumen-add.tmpl.html',
                controller: 'JenisDokumenAddController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.jenis-dokumen-edit', {
                url: '/jenis-dokumen/edit/:id',
                templateUrl: 'app/jenis-dokumen-module/jenis-dokumen-edit.tmpl.html',
                controller: 'JenisDokumenEditController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.jenis-dokumen-view', {
                url: '/jenis-dokumen/view/:id',
                templateUrl: 'app/jenis-dokumen-module/jenis-dokumen-view.tmpl.html',
                controller: 'JenisDokumenViewController',
                controllerAs: 'vm'
            });
    }
})();
