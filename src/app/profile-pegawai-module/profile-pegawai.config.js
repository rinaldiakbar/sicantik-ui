(function() {
    'use strict';

    angular
        .module('profile-pegawai-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/profile-pegawai-module');

        $stateProvider
        .state('triangular.admin-default.profile-pegawai', {
            url: '/profile/profile-pegawai',
            templateUrl: 'app/profile-pegawai-module/profile-pegawai-list.tmpl.html',
            controller: 'ProfilePegawaiListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pegawai-add', {
            url: '/profile/profile-pegawai-add',
            templateUrl: 'app/profile-pegawai-module/profile-pegawai-add.tmpl.html',
            controller: 'ProfilePegawaiAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pegawai-edit', {
            url: '/profile/profile-pegawai-edit/:id',
            templateUrl: 'app/profile-pegawai-module/profile-pegawai-edit.tmpl.html',
            controller: 'ProfilePegawaiEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pegawai-view', {
            url: '/profile/profile-pegawai-view/:id',
            templateUrl: 'app/profile-pegawai-module/profile-pegawai-view.tmpl.html',
            controller: 'ProfilePegawaiViewController',
            controllerAs: 'vm'
        });
    }
})();
