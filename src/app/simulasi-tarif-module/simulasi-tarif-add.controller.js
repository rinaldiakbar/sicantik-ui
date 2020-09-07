(function () {
    'use strict';

    angular
        .module('simulasi-tarif-module')
        .controller('SimulasiTarifAddController', SimulasiTarifAddController);

    /* @ngInject */
    function SimulasiTarifAddController($http, $log, EnvironmentConfig, AppFactory, SimulasiTarifFactory, PermohonanIzinFactory) {
        var vm = this;

        /*** BEGIN - Main Form ***/
        vm.tarif_item = [];
        vm.jenisIzinList = [];
        vm.formData = [];
        vm.total = 0;
        vm.query = {
            'only_bertarif': 'T'
        };

        PermohonanIzinFactory.getJenisIzinList(vm.query).then(function (res) {
            vm.jenisIzinList = res.data.data.items;
            vm.total = 0;
            vm.formData = [];
        });

        vm.pilihItem = pilihItem;
        vm.hitungSimulasi = hitungSimulasi;
        vm.getFormSimulasi = getFormSimulasi;

        //////////////////////
        function getFormSimulasi() {
            SimulasiTarifFactory.getFormSimulasiTarif(vm.jenis_izin_id).then(function (res) {
                angular.copy(res.data.data.tarif_item, vm.tarif_item);
                angular.copy(res.data.data.permohonan_izin, vm.permohonan_izin);
                vm.formData.items = {};

                //BEGIN - Parsing Data Setting untuk ditampilkan menjadi form
                for (var key in vm.tarif_item) {
                    var item = vm.tarif_item[key];
                    var kodeItem = item.kode_item;
                    vm.formData.items[kodeItem] = [];//Initialize agar tidak error
                    vm.formData.items[kodeItem][1] = 1;//Field Jumlah Item
                    vm.formData.items[kodeItem][2] = 0;//Field Subtotal
                    vm.formData.items[kodeItem][3] = item.nama_item;//Field Nama Item
                    vm.formData.items[kodeItem][4] = item.satuan;//Field Satuan
                }
                //END - Parsing Data Setting untuk ditampilkan menjadi form
            });
        }

        function pilihItem(kodeItem, itemInput) {
            vm.formData.items[kodeItem][2] = itemInput[0] * itemInput[1];//Isikan subtotal dengan hasil perkalian harga dan jumlah item
        }

        /**
         * Kalkulasi total nilai retribusi yang harus dibayar
         */
        function hitungSimulasi() {
            var reqData = vm.formData.items;
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'FormulaRetribusi/hitungSimulasi/' + vm.jenis_izin_id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            vm.enableSubmit = false;

            $http(req)
                .success(function (res) {
                    vm.total = res.data.total;
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

    }
})();
