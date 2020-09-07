(function () {
    'use strict';

    angular
        .module('retribusi-module')
        .controller('RetribusiAddController', RetribusiAddController);

    /* @ngInject */
    function RetribusiAddController($http, $state, EnvironmentConfig, $stateParams, AppFactory, RetribusiFactory, PermohonanIzinFactory) {
        var vm = this;
        var permohonanIzinId = $stateParams.permohonan_id;
        var prosesPermohonanId = $stateParams.proses_permohonan_id;

        /*** BEGIN - Main Form ***/
        vm.tarif_item = [];
        vm.permohonan_izin = {};
        vm.previous_calculation = {};
        vm.formData = [];
        vm.total = 0;
        vm.enableSubmit = false;

        RetribusiFactory.getFormRetribusi(permohonanIzinId).then(function (res) {
            angular.copy(res.data.data.tarif_item, vm.tarif_item);
            angular.copy(res.data.data.permohonan_izin, vm.permohonan_izin);
            angular.copy(res.data.data.previous_calculation, vm.previous_calculation);
            vm.formData.items = {};

            //BEGIN - Parsing Data Setting untuk ditampilkan menjadi form
            for (var key in vm.tarif_item) {
                var item = vm.tarif_item[key];
                var kodeItem = item.kode_item;

                var jumlah = 1;
                var subtotal = 0;
                var harga = null;

                if (angular.isDefined(vm.previous_calculation[kodeItem])) {
                    jumlah = vm.previous_calculation[kodeItem].jumlah;
                    subtotal = vm.previous_calculation[kodeItem].subtotal;
                    harga = vm.previous_calculation[kodeItem].harga;
                }

                vm.formData.items[kodeItem] = [];//Initialize agar tidak error
                vm.formData.items[kodeItem][0] = harga;//Field Harga
                vm.formData.items[kodeItem][1] = jumlah;//Field Jumlah Item
                vm.formData.items[kodeItem][2] = subtotal;//Field Subtotal
                vm.formData.items[kodeItem][3] = item.nama_item;//Field Nama Item
                vm.formData.items[kodeItem][4] = item.satuan;//Field Satuan
            }
            //END - Parsing Data Setting untuk ditampilkan menjadi form

            if (angular.isDefined(vm.permohonan_izin.nilai_retribusi)) {
                vm.total = vm.permohonan_izin.nilai_retribusi;
            }
        });

        vm.pilihItem = pilihItem;
        vm.hitungRetribusi = hitungRetribusi;
        vm.saveRetribusi = saveRetribusi;
        vm.saveAndNext = saveAndNext;
        vm.cancelAction = RetribusiFactory.cancelAction;

        ////////////////////
        function pilihItem(kodeItem, itemInput) {
            vm.formData.items[kodeItem][2] = itemInput[0] * itemInput[1];//Isikan subtotal dengan hasil perkalian harga dan jumlah item
        }

        /**
         * Kalkulasi total nilai retribusi yang harus dibayar
         */
        function hitungRetribusi() {
            var reqData = vm.formData.items;
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'FormulaRetribusi/hitungRetribusi/' + permohonanIzinId,
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
                })
                .finally(function () {
                    vm.enableSubmit = true;
                });
        }

        /**
         * Save calculation
         */
        function saveRetribusi() {
            var reqData = vm.formData.items;
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'FormulaRetribusi/saveForm/' + permohonanIzinId,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            vm.enableSubmit = false;

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.proses-pengajuan');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                })
                .finally(function () {
                    vm.enableSubmit = true;
                });
        }

        /**
         * Save Calculation and move to next process
         */
        function saveAndNext() {
            var reqData = vm.formData.items;
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'FormulaRetribusi/saveForm/' + permohonanIzinId,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            vm.enableSubmit = false;

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    PermohonanIzinFactory.getNextStep(permohonanIzinId, prosesPermohonanId);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                })
                .finally(function () {
                    vm.enableSubmit = true;
                });
        }
    }
})();
