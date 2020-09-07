(function () {
    'use strict';

    angular
        .module('profile-pegawai-module')
        .controller('ProfilePegawaiEditController', ProfilePegawaiEditController);

    /* @ngInject */
    function ProfilePegawaiEditController(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $scope, $log,
        AppFactory, ProfilePegawaiFactory, UnitFactory, JabatanFactory,
        PosisiFactory, PerusahaanFactory
    ) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        // vm.pegawai_atribut = [];
        vm.pegawai = [];
        vm.pegawai.c_pegawai = {};
        vm.pegawai.c_pegawai.c_pegawai_atribut = [];

        ProfilePegawaiFactory.getProfilePegawai(id).then(function(res) {
            vm.pegawai = res.data.data;

            if (vm.pegawai.c_pegawai != null) {
                initUnitAutocomplete();
                initJabatanAutocomplete();
                initPosisiAutocomplete();
                initPerusahaanAutocomplete();
            } else {
                vm.pegawai.c_pegawai = {};
                vm.pegawai.c_pegawai.c_pegawai_atribut = [];
            }
        });

        ProfilePegawaiFactory.getGenderList().then(function(res) {
            vm.genderList = res.data.data.items;
        });

        ProfilePegawaiFactory.getAgamaList().then(function(res) {
            vm.agamaList = res.data.data.items;
        });

        ProfilePegawaiFactory.getBloodList().then(function(res) {
            vm.bloodList = res.data.data.items;
        });

        vm.updateAction = updateAction;
        vm.cancelAction = ProfilePegawaiFactory.cancelAction;

        function updateAction() {
            vm.pegawai.c_pegawai.c_personal_id = vm.pegawai.id;
            var reqData = {
                // 'pegawai_atribut': vm.pegawai.c_pegawai.c_pegawai_atribut,
                'pegawai': vm.pegawai
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'cpegawai/edit/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.profile-pegawai');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - End Form ***/

        /*** BEGIN - Tab Pegawai Atribut ***/
            vm.addNewPegawaiAtribut = function() {
                if (vm.pegawai.c_pegawai == null) {
                    vm.pegawai.c_pegawai = {};
                    vm.pegawai.c_pegawai.c_pegawai_atribut = [];
                }
                if(vm.pegawai.c_pegawai.c_pegawai_atribut.length == 0){
                    vm.pegawai.c_pegawai.c_pegawai_atribut.push({
                        'unit_id': null,
                        'jabatan_id': null,
                        'posisi_id': null,
                        'tgl_mulai': null
                    });
                }
            };

            vm.removePegawaiAtribut = function(index) {
                if (vm.pegawai.c_pegawai.c_pegawai_atribut[index].id != undefined) {
                    var pegawaiAtributId = vm.pegawai.c_pegawai.c_pegawai_atribut[index].id;
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
                        ProfilePegawaiFactory.deletePegawaiAtribut(pegawaiAtributId).then(function(res) {
                            vm.pegawai.c_pegawai.c_pegawai_atribut.splice(index, 1);
                        });
                    });

                } else {
                    vm.pegawai.c_pegawai.c_pegawai_atribut.splice(index, 1);
                }
            };

            /*** BEGIN - Autocomplete for Unit ***/
                vm.selectedItemUnit       = null;
                vm.searchTextUnit         = null;
                vm.querySearchUnit        = UnitFactory.querySearchUnit;
                vm.isDisabledUnit         = false;
                vm.noCacheUnit            = true;
                vm.selectedItemChangeUnit = selectedItemChangeUnit;

                function initUnitAutocomplete() {
                    if(vm.pegawai.c_pegawai.c_pegawai_atribut.length != 0){
                        vm.pegawai.c_pegawai.c_pegawai_atribut.forEach(function(data, index) {
                            vm.searchTextUnit = data.unit.nama;
                        });
                    }
                }

                function selectedItemChangeUnit(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai.c_pegawai.c_pegawai_atribut[index].unit_id = item.id;
                    } else {
                        vm.pegawai.c_pegawai.c_pegawai_atribut[index].unit_id = null;
                    }
                }
            /*** END - Autocomplete for Unit ***/

            /*** BEGIN - Autocomplete for Jabatan ***/
                vm.selectedItemJabatan       = null;
                vm.searchTextJabatan         = null;
                vm.querySearchJabatan        = JabatanFactory.querySearchCJabatan;
                vm.isDisabledJabatan         = false;
                vm.noCacheJabatan            = true;
                vm.selectedItemChangeJabatan = selectedItemChangeJabatan;

                function initJabatanAutocomplete() {
                    if(vm.pegawai.c_pegawai.c_pegawai_atribut.length != 0){
                        vm.pegawai.c_pegawai.c_pegawai_atribut.forEach(function(data, index) {
                            vm.searchTextJabatan = data.c_jabatan.keterangan;
                        });
                    }
                }

                function selectedItemChangeJabatan(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai.c_pegawai.c_pegawai_atribut[index].jabatan_id = item.id;
                    } else {
                        vm.pegawai.c_pegawai.c_pegawai_atribut[index].jabatan_id = null;
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

                function initPosisiAutocomplete() {
                    if(vm.pegawai.c_pegawai.c_pegawai_atribut.length != 0){
                        vm.pegawai.c_pegawai.c_pegawai_atribut.forEach(function(data, index) {
                            vm.searchTextPosisi = data.c_posisi.keterangan;
                        });
                    }
                }

                function selectedItemChangePosisi(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai.c_pegawai.c_pegawai_atribut[index].posisi_id = item.id;
                    } else {
                        vm.pegawai.c_pegawai.c_pegawai_atribut[index].posisi_id = null;
                    }
                }
            /*** END - Autocomplete for Posisi ***/

            /*** BEGIN - Autocomplete for Perusahaan ***/
                vm.selectedItem       = null;
                vm.searchText         = null;
                vm.querySearch        = PerusahaanFactory.querySearchPerusahaan;
                vm.isDisabled         = false;
                vm.noCache            = true;
                vm.selectedItemChange = selectedItemChange;

                function initPerusahaanAutocomplete() {
                    if(vm.pegawai.c_pegawai.length != 0){
                        vm.searchText = vm.pegawai.c_pegawai.c_perusahaan.nama;
                    }
                }

                function selectedItemChange(item) {
                    if (angular.isDefined(item)) {
                        vm.pegawai.c_pegawai.c_perusahaan_id = item.id;
                    } else {
                        vm.pegawai.c_pegawai.c_perusahaan_id = null;
                    }
                }
            /*** END - Autocomplete for Perusahaan ***/
        /*** END - Pegawai Atribut***/
    }
})();
