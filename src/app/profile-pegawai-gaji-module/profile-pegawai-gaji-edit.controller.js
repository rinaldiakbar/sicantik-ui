(function () {
    'use strict';

    angular
        .module('profile-pegawai-gaji-module')
        .controller('ProfilePegawaiGajiEdit', ProfilePegawaiGajiEdit);

    /* @ngInject */
    function ProfilePegawaiGajiEdit(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $scope, $log,
        AppFactory, ProfileFactory, ProfilePegawaiGajiFactory, PayrollAreaFactory, PayrollGroupFactory
    ) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.pegawai = [];
        vm.pegawai.c_pegawai = {};
        vm.pegawai.c_pegawai.c_pegawai_gaji  = [];
        vm.pegawai.c_pegawai.c_pegawai_pajak = [];
        vm.pegawai.c_pegawai.c_pegawai_atribut_gaji = [];

        ProfilePegawaiGajiFactory.getPegawaiGaji(id).then(function (res) {
            vm.pegawai = res.data.data;
            if (!_.isNull(vm.pegawai.photo)) {
                vm.foto = EnvironmentConfig.api.replace('api/', '') + 'files/upload/' + vm.pegawai.photo;
            }

            if (!_.isNull(vm.pegawai.c_pegawai)) {
                initAreaAutocomplete();
                initGroupAutocomplete();
            } else {
                vm.pegawai = [];
                vm.pegawai.c_pegawai = {};
                vm.pegawai.c_pegawai.c_pegawai_gaji  = [];
                vm.pegawai.c_pegawai.c_pegawai_pajak = [];
                vm.pegawai.c_pegawai.c_pegawai_atribut_gaji = [];
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
        vm.cancelAction = ProfilePegawaiGajiFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'pegawai': vm.pegawai
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'cpegawaigaji/edit/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.profile-pegawai-gaji');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - End Form ***/

        /*** BEGIN - Tab Gaji ***/
            vm.addNewGaji = function () {
                if (_.isNull(vm.pegawai.c_pegawai)) {
                    vm.pegawai.c_pegawai = {};
                    vm.pegawai.c_pegawai.c_pegawai_gaji = [];
                }
                if (vm.pegawai.c_pegawai.c_pegawai_gaji.length == 0) {
                    vm.pegawai.c_pegawai.c_pegawai_gaji.push({
                        'gaji': null,
                        'mata_uang': null,
                        'tgl_mulai': null
                    });
                }
            };

            vm.removeGaji = function (index) {
                if (angular.isDefined(vm.pegawai.c_pegawai.c_pegawai_gaji[index].id)) {
                    var pegawaiGajiId = vm.pegawai.c_pegawai.c_pegawai_gaji[index].id;
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
                        ProfilePegawaiGajiFactory.deleteGaji(pegawaiGajiId).then(function (res) {
                            vm.pegawai.c_pegawai.c_pegawai_gaji.splice(index, 1);
                        });
                    });

                } else {
                    vm.pegawai.c_pegawai.c_pegawai_gaji.splice(index, 1);
                }
            };

            vm.addNewAtributGaji = function () {
                if (_.isNull(vm.pegawai.c_pegawai)) {
                    vm.pegawai.c_pegawai = {};
                    vm.pegawai.c_pegawai.c_pegawai_atribut_gaji = [];
                }
                if (vm.pegawai.c_pegawai.c_pegawai_atribut_gaji.length == 0) {
                    vm.pegawai.c_pegawai.c_pegawai_atribut_gaji.push({
                        'c_payroll_area_id': null,
                        'c_payroll_group_id': null,
                        'tgl_mulai': null
                    });
                }
            };

            vm.removeAtributGaji = function (index) {
                if (angular.isDefined(vm.pegawai.c_pegawai.c_pegawai_atribut_gaji[index].id)) {
                    var atributGajiId = vm.pegawai.c_pegawai.c_pegawai_atribut_gaji[index].id;
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
                        ProfilePegawaiGajiFactory.deleteAtributGaji(atributGajiId).then(function (res) {
                            vm.pegawai.c_pegawai.c_pegawai_atribut_gaji.splice(index, 1);
                        });
                    });

                } else {
                    vm.pegawai.c_pegawai.c_pegawai_atribut_gaji.splice(index, 1);
                }
            };

            /*** BEGIN - Autocomplete for Payroll Area ***/
                vm.selectedItemArea = null;
                vm.searchTextArea = null;
                vm.querySearchArea = PayrollAreaFactory.querySearchArea;
                vm.isDisabledArea = false;
                vm.noCacheArea = true;
                vm.selectedItemChangeArea = selectedItemChangeArea;

                function initAreaAutocomplete() {
                    if (vm.pegawai.c_pegawai.c_pegawai_atribut_gaji.length != 0) {
                        vm.pegawai.c_pegawai.c_pegawai_atribut_gaji.forEach(function (data, index) {
                            vm.searchTextArea = data.c_payroll_area.label;
                        });
                    }
                }

                function selectedItemChangeArea(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai.c_pegawai.c_pegawai_atribut_gaji[index].c_payroll_area_id = item.id;
                    } else {
                        vm.pegawai.c_pegawai.c_pegawai_atribut_gaji[index].c_payroll_area_id = null;
                    }
                }
            /*** END - Autocomplete for Payroll Area ***/

            /*** BEGIN - Autocomplete for Payroll Group ***/
                vm.selectedItemGroup = null;
                vm.searchTextGroup = null;
                vm.querySearchGroup = PayrollGroupFactory.querySearchGroup;
                vm.isDisabledGroup = false;
                vm.noCacheGroup = true;
                vm.selectedItemChangeGroup = selectedItemChangeGroup;

                function initGroupAutocomplete() {
                    if (vm.pegawai.c_pegawai.c_pegawai_atribut_gaji.length != 0) {
                        vm.pegawai.c_pegawai.c_pegawai_atribut_gaji.forEach(function (data, index) {
                            vm.searchTextGroup = data.c_payroll_group.label;
                        });
                    }
                }

                function selectedItemChangeGroup(item, index) {
                    if (angular.isDefined(item)) {
                        vm.pegawai.c_pegawai.c_pegawai_atribut_gaji[index].c_payroll_group_id = item.id;
                    } else {
                        vm.pegawai.c_pegawai.c_pegawai_atribut_gaji[index].c_payroll_group_id = null;
                    }
                }
            /*** END - Autocomplete for Payroll Group ***/
        /*** END - Gaji ***/

        /*** BEGIN - Pajak ***/
            vm.addNewPajak = function () {
                if (_.isNull(vm.pegawai.c_pegawai)) {
                    vm.pegawai.c_pegawai = {};
                    vm.pegawai.c_pegawai.c_pegawai_pajak = [];
                }
                if (vm.pegawai.c_pegawai.c_pegawai_pajak.length == 0) {
                    vm.pegawai.c_pegawai.c_pegawai_pajak.push({
                        'status_pajak': null,
                        'npwp': null,
                        'tgl_mulai': null
                    });
                }
            };

            vm.removePajak = function (index) {
                if (angular.isDefined(vm.pegawai.c_pegawai.c_pegawai_pajak[index].id)) {
                    var pajakId = vm.pegawai.c_pegawai.c_pegawai_pajak[index].id;
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
                        ProfilePegawaiGajiFactory.deletePajak(pajakId).then(function (res) {
                            vm.pegawai.c_pegawai.c_pegawai_pajak.splice(index, 1);
                        });
                    });

                } else {
                    vm.pegawai.c_pegawai.c_pegawai_pajak.splice(index, 1);
                }
            };
        /*** END - Pajak ***/
    }
})();
