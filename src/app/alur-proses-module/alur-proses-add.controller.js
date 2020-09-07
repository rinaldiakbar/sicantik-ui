(function () {
    'use strict';

    angular
        .module('alur-proses-module')
        .controller('AlurProsesAddController', AlurProsesAddController);

    /* @ngInject */
    function AlurProsesAddController(
        $http, $state, EnvironmentConfig, $log, $mdDialog, AppFactory, AlurProsesFactory, _
    ) {
        var vm = this;

        /*** BEGIN - Main Form ***/
        vm.alur_proses = {
            keterangan: ''
        };
        vm.alur_proses.daftar_proses = [];

        AlurProsesFactory.getTipeProsesList().then(function (res) {
            vm.tipeProsesList = res.data.data.items;
        });

        AlurProsesFactory.getTautanList().then(function (res) {
            vm.tautanList = res.data.data.items;
        });

        vm.createAction = createAction;
        vm.cancelAction = AlurProsesFactory.cancelAction;

        function createAction() {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'alur_proses',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: vm.alur_proses
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.alur-proses');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** End - Main Form ***/

        /*** BEGIN - Tab Daftar Proses ***/
        vm.addNewDaftarProses = function () {
            vm.alur_proses.daftar_proses.push({
                '_joinData': {
                    'no': null,
                    'jenis_proses_id': null,
                    'nama_proses': null,
                    'tautan': '',
                    'form_id': null,
                    'template_data_id': null,
                    'tipe': null
                }
            });
            initJenisProsesAutocomplete();
            initFormAutocomplete();
            initTemplateDataAutocomplete();
        };

        vm.removeDaftarProses = function (index) {
            if (angular.isDefined(vm.alur_proses.daftar_proses[index].id)) {
                var daftarProsesId = vm.alur_proses.daftar_proses[index].id;
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
                    AlurProsesFactory.deleteDaftarProses(daftarProsesId).then(function () {
                        vm.alur_proses.daftar_proses.splice(index, 1);
                        initJenisProsesAutocomplete();
                        initFormAutocomplete();
                        initTemplateDataAutocomplete();
                    });
                });
            } else {
                vm.alur_proses.daftar_proses.splice(index, 1);
            }
        };

        vm.searchTextJenisProses = [];
        vm.querySearchJenisProses = AlurProsesFactory.querySearchJenisProses;
        vm.selectedItemChangeJenisProses = selectedItemChangeJenisProses;

        function initJenisProsesAutocomplete() {
            vm.alur_proses.daftar_proses.forEach(function (daftar, index) {
                if (!_.isNull(daftar.jenis_prose) && angular.isDefined(daftar.jenis_prose)) {
                    vm.searchTextJenisProses[index] = daftar.jenis_prose.nama_proses;
                }
            });
        }

        function selectedItemChangeJenisProses(item, index) {
            if (angular.isDefined(item)) {
                vm.alur_proses.daftar_proses[index].jenis_proses_id = item.id;
                vm.alur_proses.daftar_proses[index].jenis_prose = {};
                vm.alur_proses.daftar_proses[index].jenis_prose.nama_proses = item.nama_proses;
                vm.alur_proses.daftar_proses[index].nama_proses = item.nama_proses;
                vm.alur_proses.daftar_proses[index].tautan = item.tautan;
            } else {
                vm.alur_proses.daftar_proses[index].jenis_proses_id = null;
            }
        }

        vm.searchTextForm = [];
        vm.querySearchForm = AlurProsesFactory.querySearchForm;
        vm.selectedItemChangeForm = selectedItemChangeForm;

        function initFormAutocomplete() {
            vm.alur_proses.daftar_proses.forEach(function (daftar, index) {
                if (!_.isNull(daftar.form) && angular.isDefined(daftar.form)) {
                    vm.searchTextForm[index] = daftar.form.nama_form;
                }
            });
        }

        function selectedItemChangeForm(item, index) {
            if (angular.isDefined(item)) {
                vm.alur_proses.daftar_proses[index].form_id = item.id;
            } else {
                vm.alur_proses.daftar_proses[index].form_id = null;
            }
        }

        vm.searchTextTemplateData = [];
        vm.querySearchTemplateData = AlurProsesFactory.querySearchTemplateData;
        vm.selectedItemChangeTemplateData = selectedItemChangeTemplateData;
        vm.onChangeTautan = onChangeTautan;

        function initTemplateDataAutocomplete() {
            vm.alur_proses.daftar_proses.forEach(function (daftar, index) {
                if (!_.isNull(daftar.template_data) && angular.isDefined(daftar.template_data)) {
                    vm.searchTextTemplateData[index] = daftar.template_data.keterangan;
                }
            });
        }

        function selectedItemChangeTemplateData(item, index) {
            if (angular.isDefined(item)) {
                vm.alur_proses.daftar_proses[index].template_data_id = item.id;
            } else {
                vm.alur_proses.daftar_proses[index].template_data_id = null;
            }
        }

        function onChangeTautan(index) {
            if (vm.alur_proses.daftar_proses[index].tautan === 'report') {
                vm.alur_proses.daftar_proses[index].tipe = 'report';
            } else {
                vm.alur_proses.daftar_proses[index].tipe = 'form';
            }
        }
        /*** END - Daftar Proses ***/
    }
})();
