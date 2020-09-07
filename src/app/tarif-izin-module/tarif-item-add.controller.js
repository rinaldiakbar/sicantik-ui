(function () {
    'use strict';

    angular
        .module('tarif-izin-module')
        .controller('TarifItemAddController', TarifItemAddController);

    /* @ngInject */
    function TarifItemAddController(
        $http, $state, EnvironmentConfig, $mdDialog, $stateParams, AppFactory, TarifIzinFactory
    ) {
        var vm = this;
        var jenisIzinId = $stateParams.jenis_izin_id;

        /*** BEGIN - Main Form ***/
        vm.tarif_item = {
            nama_item: '',
            satuan: ''
        };
        vm.tarif_harga = [];

        TarifIzinFactory.getJenisIzin(jenisIzinId).then(function (res) {
            vm.jenis_izin = res.data.data;
        });

        vm.createAction = createAction;
        vm.cancelAction = function () {
            TarifIzinFactory.cancelTarifItemAction(jenisIzinId);
        };

        function createAction() {
            var reqData = {
                'nama_item': vm.tarif_item.nama_item,
                'satuan': vm.tarif_item.satuan,
                'jenis_izin_id': jenisIzinId,
                'tarif_harga': vm.tarif_harga
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'tarif_item',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.tarif-item', {
                        'jenis_izin_id': jenisIzinId
                    });
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** End - Main Form ***/

        /*** BEGIN - Kategori ***/
        vm.addTarifHarga = function () {
            vm.tarif_harga.push({
                'kategori': null,
                'harga': null
            });
        };

        vm.removeTarifHarga = function (index) {
            if (angular.isDefined(vm.tarif_harga[index].id)) {
                var tarifHargaId = vm.tarif_harga[index].id;
                var dialog = {
                    title: 'Apakah anda yakin?',
                    content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                    ok: 'Ya',
                    cancel: 'Tidak'
                };

                $mdDialog.show(
                    $mdDialog.confirm()
                    .title(dialog.title)
                    .textContent(dialog.content)
                    .ok(dialog.ok)
                    .cancel(dialog.cancel)
                ).then(function () {
                    TarifIzinFactory.deleteTarifHarga(tarifHargaId).then(function () {
                        vm.tarif_harga.splice(index, 1);
                    });
                });

            } else {
                vm.tarif_harga.splice(index, 1);
            }
        };
        /*** END - Kategori ***/
    }
})();
