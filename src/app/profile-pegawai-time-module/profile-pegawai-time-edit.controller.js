(function () {
    'use strict';

    angular
        .module('profile-pegawai-time-module')
        .controller('ProfilePegawaiTimeEdit', ProfilePegawaiTimeEdit);

    /* @ngInject */
    function ProfilePegawaiTimeEdit(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $scope, $log,
        AppFactory, ProfileFactory, ProfilePegawaiTimeFactory, ShiftFactory, JenisAbsensiFactory
    ) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.pegawai = [];
        vm.pegawai.c_pegawai = {};
        vm.pegawai.c_pegawai.c_pegawai_shift = [];
        vm.pegawai.c_pegawai.c_pegawai_izin = [];

        ProfilePegawaiTimeFactory.getPegawaiTime(id).then(function (res) {
            vm.pegawai = res.data.data;
            if (!_.isNull(vm.pegawai.photo)) {
                vm.foto = EnvironmentConfig.api.replace('api/', '') + 'files/upload/' + vm.pegawai.photo;
            }

            if (!_.isNull(vm.pegawai.c_pegawai)) {
                initShiftAutocomplete();
                initJenisAbsensiAutocomplete();
            } else {
                vm.pegawai.c_pegawai = {};
                vm.pegawai.c_pegawai.c_pegawai_shift = [];
                vm.pegawai.c_pegawai.c_pegawai_izin = [];
            }
        });

        ProfileFactory.getGenderList().then(function (res) {
            vm.genderList = res.data.data.items;
            return ProfileFactory.getAgamaList();
        }).then(function (res) {
            vm.agamaList = res.data.data.items;
            return ProfileFactory.getBloodList();
        }).then(function (res) {
            vm.bloodList = res.data.data.items;
        });

        vm.updateAction = updateAction;
        vm.cancelAction = ProfilePegawaiTimeFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'pegawai': vm.pegawai
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'cpegawaitime/edit/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.profile-pegawai-time');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - End Form ***/

        /*** BEGIN - Tab Pegawai Shift ***/
            vm.addNewShift = function () {
                if (_.isNull(vm.pegawai.c_pegawai)) {
                    vm.pegawai.c_pegawai = {};
                    vm.pegawai.c_pegawai.c_pegawai_shift = [];
                }
                if (vm.pegawai.c_pegawai.c_pegawai_shift.length == 0) {
                    vm.pegawai.c_pegawai.c_pegawai_shift.push({
                        'c_shift_id': null,
                        'tgl_mulai': null
                    });
                }
            };

            vm.removeShift = function (index) {
                if (angular.isDefined(vm.pegawai.c_pegawai.c_pegawai_shift[index].id)) {
                    var shiftId = vm.pegawai.c_pegawai.c_pegawai_shift[index].id;
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
                    ).then(function (res) {
                        ProfilePegawaiTimeFactory.deletePegawaiShift(shiftId).then(function (res) {
                            vm.pegawai.c_pegawai.c_pegawai_shift.splice(index, 1);
                        });
                    });

                } else {
                    vm.pegawai.c_pegawai.c_pegawai_shift.splice(index, 1);
                }
            };

            /*** BEGIN - Autocomplete for Shift ***/
                vm.selectedItemShift = null;
                vm.searchTextShift  = null;
                vm.querySearchShift = ShiftFactory.querySearchShift;
                vm.isDisabledShift  = false;
                vm.noCacheShift = true;
                vm.selectedItemChangeShift = selectedItemChangeShift;

                function initShiftAutocomplete() {
                    if (vm.pegawai.c_pegawai.c_pegawai_shift.length != 0) {
                        vm.pegawai.c_pegawai.c_pegawai_shift.forEach(function (data, index) {
                            vm.searchTextShift = data.c_shift.keterangan;
                        });
                    }
                }

                function selectedItemChangeShift(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai.c_pegawai.c_pegawai_shift[index].c_shift_id = item.id;
                    } else {
                        vm.pegawai.c_pegawai.c_pegawai_shift[index].c_shift_id = null;
                    }
                }
            /*** END - Autocomplete for Shift ***/
        /*** END - Pegawai Shift***/

        /*** BEGIN - Tab Pegawai Izin ***/
            vm.addNewPegawaiIzin = function () {
                if (_.isNull(vm.pegawai.c_pegawai)) {
                    vm.pegawai.c_pegawai = {};
                    vm.pegawai.c_pegawai.c_pegawai_izin = [];
                }
                if (vm.pegawai.c_pegawai.c_pegawai_izin.length == 0) {
                    vm.pegawai.c_pegawai.c_pegawai_izin.push({
                        'c_jenis_absensi_id': null,
                        'quota': null,
                        'tgl_mulai': null
                    });
                }
            };

            vm.removePegawaiIzin = function (index) {
                if (angular.isDefined(vm.pegawai.c_pegawai.c_pegawai_izin[index].id)) {
                    var pegawaiIzinId = vm.pegawai.c_pegawai.c_pegawai_izin[index].id;
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
                    ).then(function (res) {
                        ProfilePegawaiTimeFactory.deletePegawaiIzin(pegawaiIzinId).then(function (res) {
                            vm.pegawai.c_pegawai.c_pegawai_izin.splice(index, 1);
                        });
                    });

                } else {
                    vm.pegawai.c_pegawai.c_pegawai_izin.splice(index, 1);
                }
            };

            /*** BEGIN - Autocomplete for Jenis Absen ***/
                vm.selectedItemIzin = null;
                vm.searchTextIzin = null;
                vm.querySearchIzin = JenisAbsensiFactory.querySearchIzin;
                vm.isDisabledIzin = false;
                vm.noCacheIzin = true;
                vm.selectedItemChangeIzin = selectedItemChangeIzin;

                function initJenisAbsensiAutocomplete() {
                    if (vm.pegawai.c_pegawai.c_pegawai_izin.length != 0) {
                        vm.pegawai.c_pegawai.c_pegawai_izin.forEach(function (data, index) {
                            vm.searchTextIzin = data.c_jenis_absensi.keterangan;
                        });
                    }
                }

                function selectedItemChangeIzin(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai.c_pegawai.c_pegawai_izin[index].c_jenis_absensi_id = item.id;
                    } else {
                        vm.pegawai.c_pegawai.c_pegawai_izin[index].c_jenis_absensi_id = null;
                    }
                }
            /*** END - Autocomplete for Jenis Absen ***/
        /*** END - Pegawai Izin***/
    }
})();
