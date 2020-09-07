(function() {
    'use strict';

    angular
        .module('profile-module')
        .controller('ProfileEdit', ProfileEdit);

    /* @ngInject */
    function ProfileEdit(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $scope, $log,
        AppFactory, profileFactory, UnitFactory, JabatanFactory, PosisiFactory
    ) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.pegawai_atribut = [];

        profileFactory.getProfilePegawai(id).then(function(res) {
            vm.profile = res.data.data;
        });

        profileFactory.getGenderList().then(function(res) {
            vm.genderList = res.data.data.items;
        });

        profileFactory.getAgamaList().then(function(res) {
            vm.agamaList = res.data.data.items;
        });

        profileFactory.getBloodList().then(function(res) {
            vm.bloodList = res.data.data.items;
        });

        vm.updateAction = updateAction;
        vm.cancelAction = profileFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'pegawai_atribut': vm.pegawai_atribut,
                'profile': vm.profile,
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'cpersonal/edit' + id,
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
        /*** END - End Form ***/

        /*** BEGIN - Tab Pegawai Atribut ***/
            vm.addNewPegawaiAtribut = function() {
                vm.pegawai_atribut.push({
                    'unit_id': null,
                    'jabatan_id': null,
                    'posisi': null,
                    'tgl_mulai': null
                });
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
        /*** END - Pegawai Atribut***/
    }
})();