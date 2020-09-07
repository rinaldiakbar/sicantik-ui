(function () {
    'use strict';

    angular
        .module('penomoran-module')
        .controller('PenomoranEditController', PenomoranEditController);

    /* @ngInject */
    function PenomoranEditController($http, $state, $scope, $mdDialog, EnvironmentConfig, $stateParams, AppFactory, PenomoranFactory, UnitFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.penomoran = {
            id: id,
            deskripsi: '',
            format: '',
            no_terakhir: '',
            instansi_id: null,
            unit_id: null,
            jenis_izin_id: null
        };
        vm.penomoran.penomoran_detail = [];

        PenomoranFactory.getPenomoran(id).then(function (res) {
            angular.copy(res.data.data, vm.penomoran);
            vm.searchTextInstansi = (vm.penomoran.instansi) ? vm.penomoran.instansi.nama : null;
            initUnitAutocomplete();
        });

        vm.updateAction = updateAction;
        vm.cancelAction = PenomoranFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'deskripsi': vm.penomoran.deskripsi,
                'format': vm.penomoran.format,
                'jenis_izin_id': vm.penomoran.jenis_izin_id,
                'instansi_id': vm.penomoran.instansi_id,
                'no_terakhir': vm.penomoran.no_terakhir,
                'unit_id': vm.penomoran.unit_id,
                'penomoran_detail': vm.penomoran.penomoran_detail
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'penomoran/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.penomoran');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItemInstansi = null;
        vm.searchTextInstansi = null;
        vm.querySearchInstansi = PenomoranFactory.querySearchInstansi;
        vm.isDisabledInstansi = false;
        vm.noCacheInstansi = false;
        vm.selectedItemChangeInstansi = selectedItemChangeInstansi;

        function selectedItemChangeInstansi(item) {
            if (angular.isDefined(item)) {
                vm.penomoran.instansi_id = item.id;
            } else {
                vm.penomoran.instansi_id = null;
            }
        }

        /*** END - Autocomplete for Instansi ***/

        /*** BEGIN - Tab Unit ***/
        vm.addNewDetail = function () {
            vm.penomoran.penomoran_detail.push({
                'nama': ''
            });
        };

        vm.removeDetail = function (index) {
            if (angular.isDefined(vm.penomoran.penomoran_detail[index].id)) {
                var detailId = vm.penomoran.penomoran_detail[index].id;
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
                    PenomoranFactory.deleteDetail(detailId).then(function () {
                        vm.penomoran.penomoran_detail.splice(index, 1);
                        initUnitAutocomplete();
                    });
                });
            } else {
                vm.penomoran.penomoran_detail.splice(index, 1);
                initUnitAutocomplete();
            }
        };

        vm.searchTextUnit = [];
        vm.querySearchUnit = UnitFactory.querySearchUnit;
        vm.selectedItemChangeUnit = selectedItemChangeUnit;

        function initUnitAutocomplete() {
            vm.penomoran.penomoran_detail.forEach(function (detail, index) {
                vm.searchTextUnit[index] = detail.unit.nama;
            });
        }

        function selectedItemChangeUnit(item, index) {
            if (angular.isDefined(item)) {
                vm.penomoran.penomoran_detail[index].unit_id = item.id;
                vm.penomoran.penomoran_detail[index].nama = item.nama;
            }
        }

        /*** END - Tab Unit ***/
    }
})();
