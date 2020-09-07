(function() {
    'use strict';

    angular
        .module('profile-pegawai-gaji-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/profile-pegawai-gaji-module');

        $stateProvider
        .state('triangular.admin-default.profile-pegawai-gaji', {
            url: '/profile/pegawai-gaji',
            templateUrl: 'app/profile-pegawai-gaji-module/profile-pegawai-gaji-list.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePegawaiGajiList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pegawai-gaji-edit', {
            url: '/profile/pegawai-gaji-edit/:id',
            templateUrl: 'app/profile-pegawai-gaji-module/profile-pegawai-gaji-edit.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePegawaiGajiEdit',
            controllerAs: 'vm'
        })
    }
})();
