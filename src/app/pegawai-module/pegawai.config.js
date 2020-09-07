(function() {
    'use strict';

    angular
        .module('pegawai-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/pegawai-module');

        $stateProvider
        .state('triangular.admin-default.pegawai', {
            url: '/pegawai',
            templateUrl: 'app/pegawai-module/pegawai-list.tmpl.html',
            controller: 'PegawaiListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pegawai-add', {
            url: '/pegawai/add',
            templateUrl: 'app/pegawai-module/pegawai-add.tmpl.html',
            controller: 'PegawaiAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pegawai-edit', {
            url: '/pegawai/edit/:id',
            templateUrl: 'app/pegawai-module/pegawai-edit.tmpl.html',
            controller: 'PegawaiEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pegawai-view', {
            url: '/pegawai/view/:id',
            templateUrl: 'app/pegawai-module/pegawai-view.tmpl.html',
            controller: 'PegawaiViewController',
            controllerAs: 'vm'
        })
        ;
    }
})();
