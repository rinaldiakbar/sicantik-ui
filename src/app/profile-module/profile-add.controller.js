(function() {
    'use strict';

    angular
        .module('profile-module')
        .controller('ProfileAdd', ProfileAdd);

    /* @ngInject */
    function ProfileAdd(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $scope, $log,
        AppFactory, profileFactory, Upload, UnitFactory, JabatanFactory, PosisiFactory) {
        var vm = this;

        /*** BEGIN - Main Form ***/
        vm.pegawai_atribut = [];
        vm.pegawai_keluarga = [];

        profileFactory.getGenderList().then(function(res) {
            vm.genderList = res.data.data.items;
        });

        profileFactory.getAgamaList().then(function(res) {
            vm.agamaList = res.data.data.items;
        });

        profileFactory.getBloodList().then(function(res) {
            vm.bloodList = res.data.data.items;
        });

        vm.createAction = createAction;
        vm.cancelAction = profileFactory.cancelAction;

        function createAction() {
            var reqData = {
                'pegawai_atribut': vm.pegawai_atribut,
                'profile': vm.profile
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'cpersonal/add',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.profile-personal');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** End - Main Form ***/

        /*** BEGIN - Tab Pegawai Atribut ***/
            vm.addNewPegawaiAtribut = function() {
                if(vm.pegawai_atribut.length == 0){
                    vm.pegawai_atribut.push({
                        'unit_id': null,
                        'jabatan_id': null,
                        'posisi': null,
                        'tgl_mulai': null
                    });
                }
            };

            vm.removePegawaiAtribut = function(index) {
                if (vm.pegawai_atribut[index].id != undefined) {
                    var pegawaiAtributId = vm.pegawai_atribut[index].id;
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
                    ).then(function(res) {
                        profileFactory.deletePegawaiAtribut(pegawaiAtributId).then(function(res) {
                            vm.pegawai_atribut.splice(index, 1);
                        });
                    });

                } else {
                    vm.pegawai_atribut.splice(index, 1);
                }
            };

            /*** BEGIN - Autocomplete for Unit ***/
                vm.selectedItemUnit       = null;
                vm.searchTextUnit         = null;
                vm.querySearchUnit        = UnitFactory.querySearchUnit;
                vm.isDisabledUnit         = false;
                vm.noCacheUnit            = true;
                vm.selectedItemChangeUnit = selectedItemChangeUnit;

                function selectedItemChangeUnit(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai_atribut[index].unit_id = item.id;
                    } else {
                        vm.pegawai_atribut[index].unit_id = null;
                    }
                }
            /*** END - Autocomplete for Unit ***/

            /*** BEGIN - Autocomplete for Jabatan ***/
                vm.selectedItemJabatan       = null;
                vm.searchTextJabatan         = null;
                vm.querySearchJabatan        = JabatanFactory.querySearchJabatan;
                vm.isDisabledJabatan         = false;
                vm.noCacheJabatan            = true;
                vm.selectedItemChangeJabatan = selectedItemChangeJabatan;

                function selectedItemChangeJabatan(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai_atribut[index].jabatan_id = item.id;
                    } else {
                        vm.pegawai_atribut[index].jabatan_id = null;
                    }
                }
            /*** END - Autocomplete for Jabatan ***/

            /*** BEGIN - Autocomplete for Posisi ***/
                vm.selectedItemPosisi       = null;
                vm.searchTextPosisi         = null;
                vm.querySearchPosisi        = PosisiFactory.querySearchPosisi;
                vm.isDisabledPosisi         = false;
                vm.noCachePosisi            = true;
                vm.selectedItemChangePosisi = selectedItemChangePosisi;

                function selectedItemChangePosisi(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai_atribut[index].posisi_id = item.id;
                    } else {
                        vm.pegawai_atribut[index].posisi_id = null;
                    }
                }
            /*** END - Autocomplete for Posisi ***/
        /*** END - Pegawai Atribut***/

        /*** BEGIN - Tab Pegawai Keluarga ***/
            vm.addNewPegawaiKeluarga = function() {
                if(vm.pegawai_keluarga.length == 0){
                    vm.pegawai_keluarga.push({
                        'nama': null,
                        'hubungan': null,
                        'tgl_lahir': null,
                        'pendidikan_terakhir': null,
                        'pekerjaan': null
                    });
                }
            };

            vm.removePegawaiKeluarga = function(index) {
                if (vm.pegawai_keluarga[index].id != undefined) {
                    var pegawaiKeluargaId = vm.pegawai_keluarga[index].id;
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
                    ).then(function(res) {
                        profileFactory.deletePegawaiAtribut(pegawaiKeluargaId).then(function(res) {
                            vm.pegawai_keluarga.splice(index, 1);
                        });
                    });

                } else {
                    vm.pegawai_keluarga.splice(index, 1);
                }
            };
        /*** END - Pegawai Keluarga***/
    }
})();