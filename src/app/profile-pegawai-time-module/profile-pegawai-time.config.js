(function() {
    'use strict';

    angular
        .module('profile-pegawai-time-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/profile-pegawai-time-module');

        $stateProvider
        .state('triangular.admin-default.profile-pegawai-time', {
            url: '/profile/pegawai-time',
            templateUrl: 'app/profile-pegawai-time-module/profile-pegawai-time-list.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePegawaiTimeList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pegawai-time-edit', {
            url: '/profile/pegawai-time-edit/:id',
            templateUrl: 'app/profile-pegawai-time-module/profile-pegawai-time-edit.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePegawaiTimeEdit',
            controllerAs: 'vm'
        })
    }
})();
