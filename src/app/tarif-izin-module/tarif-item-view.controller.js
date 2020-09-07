(function() {
    'use strict';

    angular
        .module('tarif-izin-module')
        .controller('TarifItemViewController', TarifItemViewController);

    /* @ngInject */
    function TarifItemViewController($http, $state, EnvironmentConfig, $stateParams, TarifIzinFactory) {
        var vm = this;
        var id = $stateParams.id;
        var jenisIzinId = $stateParams.jenis_izin_id;

        /*** BEGIN - Main Form ***/
        vm.tarif_item = {
            id : id,
            nama_item : '',
            satuan : ''
        };
        vm.tarif_harga = [];

        TarifIzinFactory.getTarifItem(id).then(function (res) {
            angular.copy(res.data.data, vm.tarif_item);
            vm.tarif_harga = res.data.data.tarif_harga;
        });

        vm.cancelAction = function() {
            TarifIzinFactory.cancelTarifItemAction(jenisIzinId);
        };
    }
})();
