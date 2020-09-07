(function() {
    'use strict';

    angular
        .module('profile-pemohon-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/profile-pemohon-module');

        $stateProvider
        .state('triangular.admin-default.profile-pemohon-view', {
            url: '/profile/pemohon',
            templateUrl: 'app/profile-pemohon-module/profile-pemohon-view.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePemohonView',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pemohon-edit-empty', {
            url: '/profile/pemohon/edit',
            templateUrl: 'app/profile-pemohon-module/profile-pemohon-edit.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePemohonEdit',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pemohon-permohonan-izin-add', {
            url: '/profile/pemohon/permohonan-izin-add',
            templateUrl: 'app/profile-pemohon-module/profile-pemohon-permohonan-izin-add.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePemohonPermohonanIzinAdd',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pemohon-permohonan-izin-detail', {
            url: '/profile/pemohon/permohonan-izin-detail/:permohonan_id',
            templateUrl: 'app/profile-pemohon-module/profile-pemohon-permohonan-izin-detail.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePemohonPermohonanIzinDetail',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pemohon-perusahaan-detail', {
            url: '/profile/pemohon/perusahaan-detail/:perusahaan_id',
            templateUrl: 'app/profile-pemohon-module/profile-pemohon-perusahaan-detail.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePemohonPerusahaanDetail',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pemohon-izin-detail', {
            url: '/profile/pemohon/izin-detail/:key_id/:izin_id',
            templateUrl: 'app/profile-pemohon-module/profile-pemohon-izin-detail.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePemohonIzinDetail',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pemohon-dokumen-detail', {
            url: '/profile/pemohon/dokumen-detail/:dokumen_pemohon_id',
            templateUrl: 'app/profile-pemohon-module/profile-pemohon-dokumen-detail.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePemohonDokumenDetail',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-pemohon-dokumen-add', {
            url: '/profile/pemohon/dokumen-add',
            templateUrl: 'app/profile-pemohon-module/profile-pemohon-dokumen-add.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfilePemohonDokumenAdd',
            controllerAs: 'vm'
        });
    }
})();
