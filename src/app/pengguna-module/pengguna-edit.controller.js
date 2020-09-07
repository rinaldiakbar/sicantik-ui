(function () {
    'use strict';

    angular
        .module('pengguna-module')
        .controller('PenggunaEditController', PenggunaEditController);

    /* @ngInject */
    function PenggunaEditController($http, $state, EnvironmentConfig, $stateParams, $log, $scope, $mdDialog, AppFactory, PenggunaFactory, usernameFilter) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.pengguna = {
            id: id,
            username: '',
            password: '',
            peran_id: 0,
            pegawai_id: 0
        };
        vm.unit = [];
        vm.jenis_izin = [];
        vm.jenis_proses = [];
        vm.pegawaiInstansiId = null;
        vm.pegawaiMandatory = EnvironmentConfig.name === 'SICANTIK' ? true : false;

        vm.usernameChange = usernameChange;
        vm.updateAction = updateAction;
        vm.cancelAction = PenggunaFactory.cancelAction;

        // GET the original Data
        PenggunaFactory.getPengguna(id).then(function (res) {
            angular.copy(res.data.data, vm.pengguna);
            vm.searchText = res.data.data.peran.label_peran;
            vm.unit = res.data.data.unit;
            vm.jenis_izin = res.data.data.jenis_izin;
            vm.jenis_proses = res.data.data.jenis_proses;

            if (res.data.data.pegawai) {
                vm.searchTextPegawai = res.data.data.pegawai.nama;
                vm.pegawaiInstansiId = res.data.data.pegawai.instansi_id;
            }

            initUnitAutocomplete();
            initJenisIzinAutocomplete();
            initJenisProsesAutocomplete();
        });

        function usernameChange() {
            vm.pengguna.username = usernameFilter(vm.pengguna.username);
        }

        function updateAction() {
            var reqData = {
                'username': vm.pengguna.username,
                'email': vm.pengguna.email,
                'password': vm.pengguna.password,
                'peran_id': vm.pengguna.peran_id,
                'pegawai_id': vm.pengguna.pegawai_id,
                'unit': vm.unit,
                'jenis_izin': vm.jenis_izin,
                'jenis_proses': vm.jenis_proses
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'pengguna/' + vm.pengguna.id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.pengguna');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - Main Form ***/


        /*** BEGIN - Autocomplete for Peran ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = PenggunaFactory.querySearchPeran;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChangePeran;

        function selectedItemChangePeran(item) {
            if (angular.isDefined(item)) {
                vm.pengguna.peran_id = item.id;
            } else {
                vm.pengguna.peran_id = null;
            }
        }
        /*** END - Autocomplete for Peran ***/


        /*** BEGIN - Autocomplete for Pegawai ***/
        vm.selectedItemPegawai = null;
        vm.searchTextPegawai = null;
        vm.querySearchPegawai = PenggunaFactory.querySearchPegawai;
        vm.isDisabledPegawai = false;
        vm.noCachePegawai = false;
        vm.selectedItemChangePegawai = selectedItemChangePegawai;

        function selectedItemChangePegawai(item) {
            if (angular.isDefined(item)) {
                vm.pengguna.pegawai_id = item.id;
                vm.pegawaiInstansiId = item.instansi_id;
            } else {
                vm.pengguna.pegawai_id = null;
            }
        }
        /*** END - Autocomplete for Pegawai ***/


        /*** BEGIN - Tab Unit ***/
        vm.addNewUnit = function () {
            vm.unit.push({
                'nama': ''
            });
            initUnitAutocomplete();
        };

        vm.removeUnit = function (index) {
            if (angular.isDefined(vm.unit[index]._joinData)) {
                var unitId = vm.unit[index]._joinData.unit_id;
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
                    PenggunaFactory.deleteUnit(vm.pengguna.id, unitId).then(function () {
                        vm.unit.splice(index, 1);
                        initUnitAutocomplete();
                    });
                });
            } else {
                vm.unit.splice(index, 1);
                initUnitAutocomplete();
            }
        };

        vm.searchTextUnit = [];
        vm.querySearchUnit = PenggunaFactory.querySearchUnit;
        vm.selectedItemChangeUnit = selectedItemChangeUnit;

        function initUnitAutocomplete() {
            vm.unit.forEach(function (unit, index) {
                vm.searchTextUnit[index] = unit.nama;
            });
        }

        function selectedItemChangeUnit(item, index) {
            if (angular.isDefined(item)) {
                vm.unit[index].id = item.id;
                vm.unit[index].nama = item.nama;
            } else {
                vm.unit[index].id = null;
            }
        }
        /*** END - Tab Unit ***/


        /*** BEGIN - Tab Jenis Izin ***/
        vm.addNewJenisIzin = function () {
            vm.jenis_izin.push({
                'jenis_izin': ''
            });
            initJenisIzinAutocomplete();
        };

        vm.removeJenisIzin = function (index) {
            if (angular.isDefined(vm.jenis_izin[index]._joinData)) {
                var jenisIzinId = vm.jenis_izin[index]._joinData.jenis_izin_id;
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
                    PenggunaFactory.deleteJenisIzin(vm.pengguna.id, jenisIzinId).then(function () {
                        vm.jenis_izin.splice(index, 1);
                        initJenisIzinAutocomplete();
                    });
                });
            } else {
                vm.jenis_izin.splice(index, 1);
                initJenisIzinAutocomplete();
            }
        };

        vm.searchTextJenisIzin = [];
        vm.querySearchJenisIzin = PenggunaFactory.querySearchJenisIzin;
        vm.selectedItemChangeJenisIzin = selectedItemChangeJenisIzin;

        function initJenisIzinAutocomplete() {
            vm.jenis_izin.forEach(function (jenisIzin, index) {
                vm.searchTextJenisIzin[index] = jenisIzin.jenis_izin;
            });
        }

        function selectedItemChangeJenisIzin(item, index) {
            if (angular.isDefined(item)) {
                vm.jenis_izin[index].id = item.id;
                vm.jenis_izin[index].jenis_izin = item.jenis_izin;
            } else {
                vm.jenis_proses[index].id = null;
            }
        }
        /*** END - Tab Jenis Izin ***/


        /*** BEGIN - Tab Jenis Proses ***/
        vm.addNewJenisProses = function () {
            vm.jenis_proses.push({
                'jenis_proses': ''
            });
            initJenisProsesAutocomplete();
        };

        vm.removeJenisProses = function (index) {
            if (angular.isDefined(vm.jenis_proses[index]._joinData)) {
                var jenisProsesId = vm.jenis_proses[index]._joinData.jenis_proses_id;
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
                    PenggunaFactory.deleteJenisProses(vm.pengguna.id, jenisProsesId).then(function () {
                        vm.jenis_proses.splice(index, 1);
                        initJenisProsesAutocomplete();
                    });
                });
            } else {
                vm.jenis_proses.splice(index, 1);
                initJenisProsesAutocomplete();
            }
        };

        vm.searchTextJenisProses = [];
        vm.querySearchJenisProses = PenggunaFactory.querySearchJenisProses;
        vm.selectedItemChangeJenisProses = selectedItemChangeJenisProses;

        function initJenisProsesAutocomplete() {
            vm.jenis_proses.forEach(function (jenisProses, index) {
                vm.searchTextJenisProses[index] = jenisProses.nama_proses;
            });
        }

        function selectedItemChangeJenisProses(item, index) {
            if (angular.isDefined(item)) {
                vm.jenis_proses[index].id = item.id;
                vm.jenis_proses[index].nama_proses = item.nama_proses;
            } else {
                vm.jenis_proses[index].id = null;
            }
        }
        /*** END - Tab Jenis Proses ***/
    }
})();
