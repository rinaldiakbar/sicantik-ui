(function() {
    'use strict';

    angular
        .module('jenis-usaha-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/jenis-usaha-module');

        $stateProvider
            .state('triangular.admin-default.jenis-usaha', {
                url: '/jenis-usaha',
                templateUrl: 'app/jenis-usaha-module/jenis-usaha-list.tmpl.html',
                controller: 'JenisUsahaListController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.jenis-usaha-add', {
                url: '/jenis-usaha/add',
                templateUrl: 'app/jenis-usaha-module/jenis-usaha-add.tmpl.html',
                controller: 'JenisUsahaAddController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.jenis-usaha-edit', {
                url: '/jenis-usaha/edit/:id',
                templateUrl: 'app/jenis-usaha-module/jenis-usaha-edit.tmpl.html',
                controller: 'JenisUsahaEditController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.jenis-usaha-view', {
                url: '/jenis-usaha/view/:id',
                templateUrl: 'app/jenis-usaha-module/jenis-usaha-view.tmpl.html',
                controller: 'JenisUsahaViewController',
                controllerAs: 'vm'
            })
        ;
    }
})();
