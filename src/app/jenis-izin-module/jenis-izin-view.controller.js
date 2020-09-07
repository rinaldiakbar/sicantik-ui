(function() {
    'use strict';

    angular
        .module('jenis-izin-module')
        .controller('JenisIzinViewController', JenisIzinViewController);

    /* @ngInject */
    function JenisIzinViewController($http, $state, EnvironmentConfig, $stateParams, JenisIzinFactory) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.jenis_izin = {
            id : id,
            jenis_izin : '',
            kode_oss: null,
            default_active: false
        };
        vm.jenis_pengajuan = [];
        vm.unit_terkait = [];
        vm.dokumen_pendukung = [];
        vm.izin_paralel = [];

        JenisIzinFactory.getJenisIzin(id).then(function (res) {
            angular.copy(res.data.data, vm.jenis_izin);
            vm.jenis_pengajuan = res.data.data.jenis_pengajuan;
            vm.unit_terkait = res.data.data.unit_terkait;
            vm.dokumen_pendukung = res.data.data.dokumen_pendukung;
            vm.izin_paralel = res.data.data.izin_paralel;
        });

        JenisIzinFactory.getJenisPengajuanList().then(function(res) {
            vm.jenisPengajuanList = res.data.data.items;
        });

        JenisIzinFactory.getSatuanList().then(function(res) {
            vm.satuanList = res.data.data.items;
        });

        JenisIzinFactory.getListStatusDokumen().then(function(res) {
            vm.statusList = res.data.data.items;
        });

        vm.cancelAction = JenisIzinFactory.cancelAction;
    }
})();
