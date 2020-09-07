(function () {
    'use strict';

    angular
        .module('tarif-izin-module')
        .controller('TarifItemEditController', TarifItemEditController);

    /* @ngInject */
    function TarifItemEditController(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $scope, AppFactory, TarifIzinFactory
    ) {
        var vm = this;
        var id = $stateParams.id;
        var jenisIzinId = $stateParams.jenis_izin_id;

        /*** BEGIN - Main Form ***/
        vm.tarif_item = {
            id: id,
            nama_item: '',
            satuan: ''
        };
        vm.tarif_harga = [];

        TarifIzinFactory.getTarifItem(id).then(function (res) {
            angular.copy(res.data.data, vm.tarif_item);
            vm.tarif_harga = res.data.data.tarif_harga;
        });

        vm.updateAction = updateAction;
        vm.cancelAction = function () {
            TarifIzinFactory.cancelTarifItemAction(jenisIzinId);
        };

        function updateAction() {
            var reqData = {
                'nama_item': vm.tarif_item.nama_item,
                'satuan': vm.tarif_item.satuan,
                'tarif_harga': vm.tarif_harga
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'tarif_item/' + id,
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
        /*** END - End Form ***/

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
