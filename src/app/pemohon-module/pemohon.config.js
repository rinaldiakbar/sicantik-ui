(function() {
    'use strict';

    angular
        .module('pemohon-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/pemohon-module');

        $stateProvider
        .state('triangular.admin-default.pemohon-list', {
            url: '/pemohon',
            templateUrl: 'app/pemohon-module/pemohon-list.tmpl.html',
            controller: 'PemohonListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-view', {
            url: '/pemohon/view/:key_id',
            templateUrl: 'app/pemohon-module/pemohon-view.tmpl.html',
            controller: 'PemohonViewController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-edit', {
            url: '/pemohon/edit/:key_id',
            templateUrl: 'app/pemohon-module/pemohon-edit.tmpl.html',
            controller: 'PemohonEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-permohonan-izin-add', {
            url: '/pemohon/permohonan-izin-add/:key_id',
            templateUrl: 'app/pemohon-module/pemohon-permohonan-izin-add.tmpl.html',
            controller: 'PemohonPermohonanIzinAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-permohonan-izin-detail', {
            url: '/pemohon/permohonan-izin-detail/:key_id/:permohonan_id',
            templateUrl: 'app/pemohon-module/pemohon-permohonan-izin-detail.tmpl.html',
            controller: 'PemohonPermohonanIzinDetailController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-perusahaan-detail', {
            url: '/pemohon/perusahaan-detail/:key_id/:perusahaan_id',
            templateUrl: 'app/pemohon-module/pemohon-perusahaan-detail.tmpl.html',
            controller: 'PemohonPerusahaanDetailController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-izin-detail', {
            url: '/pemohon/izin-detail/:key_id/:izin_id',
            templateUrl: 'app/pemohon-module/pemohon-izin-detail.tmpl.html',
            controller: 'PemohonIzinDetailController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-dokumen-detail', {
            url: '/pemohon/dokumen-detail/:key_id/:dokumen_pemohon_id',
            templateUrl: 'app/pemohon-module/pemohon-dokumen-detail.tmpl.html',
            controller: 'PemohonDokumenDetailController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-dokumen-add', {
            url: '/pemohon/dokumen-add/:key_id',
            templateUrl: 'app/pemohon-module/pemohon-dokumen-add.tmpl.html',
            controller: 'PemohonDokumenAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-dokumen-add-jenis', {
            url: '/pemohon/dokumen-add/:key_id/:jenis_dokumen_id/:permohonan_id',
            templateUrl: 'app/pemohon-module/pemohon-dokumen-add.tmpl.html',
            controller: 'PemohonDokumenAddController',
            controllerAs: 'vm'
        });
    }
})();
