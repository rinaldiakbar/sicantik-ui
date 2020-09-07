(function () {
    'use strict';

    angular
        .module('jenis-izin-module')
        .controller('JenisIzinAddController', JenisIzinAddController);

    /* @ngInject */
    function JenisIzinAddController(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $scope, $log,
        AppFactory, JenisIzinFactory, JenisDokumenFactory, PenomoranFactory
    ) {
        var vm = this;

        /*** BEGIN - Main Form ***/
        vm.jenis_izin = {
            jenis_izin: null,
            short_desc: null,
            kode_oss: null,
            jenis_dokumen_id: null,
            default_active: false
        };
        vm.jenis_pengajuan = [];
        vm.unit_terkait = [];
        vm.dokumen_pendukung = [];
        vm.izin_paralel = [];

        JenisIzinFactory.getJenisPengajuanList().then(function (res) {
            vm.jenisPengajuanList = res.data.data.items;
        });

        JenisIzinFactory.getSatuanList().then(function (res) {
            vm.satuanList = res.data.data.items;
        });

        JenisIzinFactory.getListStatusDokumen().then(function (res) {
            vm.statusList = res.data.data.items;
        });

        vm.createAction = createAction;
        vm.cancelAction = JenisIzinFactory.cancelAction;

        function createAction() {
            var reqData = {
                'jenis_izin': vm.jenis_izin.jenis_izin,
                'short_desc': vm.jenis_izin.short_desc,
                'jenis_dokumen_id': vm.jenis_izin.jenis_dokumen_id,
                'kode_oss': vm.jenis_izin.kode_oss,
                'jenis_pengajuan': vm.jenis_pengajuan,
                'unit_terkait': vm.unit_terkait,
                'dokumen_pendukung': vm.dokumen_pendukung,
                'izin_paralel': vm.izin_paralel,
                'default_active': vm.jenis_izin.default_active
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'jenis_izin',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.jenis-izin');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** End - Main Form ***/

        /*** BEGIN - Autocomplete for Jenis Dokumen ***/
        vm.searchTextJenisDokumenIzin = '';
        vm.querySearchJenisDokumenIzin = JenisDokumenFactory.querySearchJenisDokumen;
        vm.selectedItemChangeJenisDokumenIzin = selectedItemChangeJenisDokumenIzin;

        function selectedItemChangeJenisDokumenIzin(item) {
            if (angular.isDefined(item)) {
                vm.jenis_izin.jenis_dokumen_id = item.id;
                vm.jenis_izin.jenis_dokumen_label = item.deskripsi;
            } else {
                vm.jenis_izin.jenis_dokumen_id = null;
                vm.jenis_izin.jenis_dokumen_label = null;
            }
        }
        /*** END - Autocomplete for Parent Jenis Dokumen ***/

        /*** BEGIN - Tab Jenis Pengajuan ***/
        vm.addNewJenisPengajuan = function () {
            vm.jenis_pengajuan.push({
                'jenis_pengajuan': '',
                'alur_proses_id': null,
                'lama_proses': null,
                'masa_berlaku_izin': null
            });
        };

        vm.removeJenisPengajuan = function (index) {
            if (angular.isDefined(vm.jenis_pengajuan[index].id)) {
                var jenisPengajuanId = vm.jenis_pengajuan[index].id;
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
                    JenisIzinFactory.deleteJenisPengajuan(jenisPengajuanId).then(function () {
                        vm.jenis_pengajuan.splice(index, 1);
                        initJenisPengajuanAutocomplete();
                    });
                });

            } else {
                vm.jenis_pengajuan.splice(index, 1);
                initJenisPengajuanAutocomplete();
            }
        };

        vm.searchTextAlurProses = [];
        vm.querySearchAlurProses = JenisIzinFactory.querySearchAlurProses;
        vm.selectedItemChangeAlurProses = selectedItemChangeAlurProses;

        function selectedItemChangeAlurProses(item, index) {
            if (angular.isDefined(item)) {
                vm.jenis_pengajuan[index].alur_proses_id = item.id;
            }
        }

        vm.searchTextPenomoran = [];
        vm.querySearchPenomoran = PenomoranFactory.querySearchPenomoran;
        vm.selectedItemChangePenomoran = selectedItemChangePenomoran;

        function selectedItemChangePenomoran(item, index) {
            if (angular.isDefined(item)) {
                vm.jenis_pengajuan[index].penomoran_id = item.id;
            }
        }

        function initJenisPengajuanAutocomplete() {
            vm.jenis_pengajuan.forEach(function (jenis_pengajuan, index) {
                if (jenis_pengajuan.alur_prose) {
                    vm.searchTextAlurProses[index] = jenis_pengajuan.alur_prose.keterangan;
                }
                if (jenis_pengajuan.penomoran) {
                    vm.searchTextPenomoran[index] = jenis_pengajuan.penomoran.format;
                }
            });
        }
        /*** END - Jenis Pengajuan ***/

        /*** BEGIN - Unit Terkait ***/
        vm.addNewUnitTerkait = function () {
            vm.unit_terkait.push({
                'unit_id': null
            });
        };

        vm.removeUnitTerkait = function (index) {
            if (angular.isDefined(vm.unit_terkait[index].id)) {
                var unitTerkaitId = vm.unit_terkait[index].id;
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
                    JenisIzinFactory.deleteUnitTerkait(unitTerkaitId).then(function () {
                        vm.unit_terkait.splice(index, 1);
                        initUnitTerkaitAutocomplete();
                    });
                });

            } else {
                vm.unit_terkait.splice(index, 1);
                initUnitTerkaitAutocomplete();
            }
        };

        vm.searchTextUnitTerkait = [];
        vm.querySearchUnitTerkait = JenisIzinFactory.querySearchUnit;
        vm.selectedItemChangeUnitTerkait = selectedItemChangeUnitTerkait;

        function selectedItemChangeUnitTerkait(item, index) {
            if (angular.isDefined(item)) {
                vm.unit_terkait[index].unit_id = item.id;
            }
        }

        function initUnitTerkaitAutocomplete() {
            vm.unit_terkait.forEach(function (unit_terkait, index) {
                if (angular.isDefined(unit_terkait.unit)) {
                    vm.searchTextUnitTerkait[index] = unit_terkait.unit.nama;
                }
            });
        }
        /*** END - Unit Terkait ***/

        /*** BEGIN - Dokumen Pendukung ***/
        vm.addNewDokumenPendukung = function () {
            vm.dokumen_pendukung.push({
                'nama_dokumen': null,
                'status': null
            });
        };

        vm.removeDokumenPendukung = function (index) {
            if (angular.isDefined(vm.dokumen_pendukung[index].id)) {
                var dokumenPendukungId = vm.dokumen_pendukung[index].id;
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
                    JenisIzinFactory.deleteDokumenPendukung(dokumenPendukungId).then(function () {
                        vm.dokumen_pendukung.splice(index, 1);
                        initDokumenPendukungAutocomplete();
                    });
                });

            } else {
                vm.dokumen_pendukung.splice(index, 1);
                initDokumenPendukungAutocomplete();
            }
        };

        vm.searchTextJenisDokumen = [];
        vm.querySearchJenisDokumen = JenisDokumenFactory.querySearchJenisDokumen;
        vm.selectedItemChangeJenisDokumen = selectedItemChangeJenisDokumen;

        function selectedItemChangeJenisDokumen(item, index) {
            if (angular.isDefined(item)) {
                vm.dokumen_pendukung[index].jenis_dokumen_id = item.id;
                vm.dokumen_pendukung[index].jenis_dokumen_label = item.deskripsi;
            }
        }

        function initDokumenPendukungAutocomplete() {
            vm.dokumen_pendukung.forEach(function (dokumen, index) {
                if (angular.isDefined(dokumen.jenis_dokuman)) {
                    vm.searchTextJenisDokumen[index] = dokumen.jenis_dokuman.deskripsi;
                } else {
                    vm.searchTextJenisDokumen[index] = dokumen.jenis_dokuman_label;
                }
            });
        }
        /*** END - Dokumen Pendukung ***/

        /*** BEGIN - Izin Paralel ***/
        vm.addNewIzinParalel = function () {
            vm.izin_paralel.push({
                'izin_paralel_id': null
            });
        };

        vm.removeIzinParalel = function (index) {
            if (angular.isDefined(vm.izin_paralel[index].id)) {
                var izinParalelId = vm.izin_paralel[index].id;
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
                    JenisIzinFactory.deleteIzinParalel(izinParalelId).then(function () {
                        vm.izin_paralel.splice(index, 1);
                        initIzinParalelAutocomplete();
                    });
                });

            } else {
                vm.izin_paralel.splice(index, 1);
                initIzinParalelAutocomplete();
            }
        };

        vm.searchTextJenisIzin = [];
        vm.querySearchJenisIzin = JenisIzinFactory.querySearchJenisIzin;
        vm.selectedItemChangeJenisIzin = selectedItemChangeJenisIzin;

        function selectedItemChangeJenisIzin(item, index) {
            if (angular.isDefined(item)) {
                vm.izin_paralel[index].izin_paralel_id = item.id;
                vm.izin_paralel[index].izin_paralel_id_label = item.jenis_izin;
            }
        }

        function initIzinParalelAutocomplete() {
            vm.izin_paralel.forEach(function (izin_paralel, index) {
                if (angular.isDefined(izin_paralel.jenis_izin)) {
                    vm.searchTextJenisIzin[index] = izin_paralel.jenis_izin.jenis_izin;
                } else {
                    vm.searchTextJenisIzin[index] = izin_paralel.izin_paralel_id_label;
                }
            });
        }
        /*** END - Izin Paralel ***/
    }
})();
