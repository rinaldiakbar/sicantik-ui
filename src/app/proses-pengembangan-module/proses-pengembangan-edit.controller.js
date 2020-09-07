(function () {
    'use strict';

    angular
        .module('proses-pengembangan-module')
        .controller('ProsesPengembanganEdit', ProsesPengembanganEdit);

    /* @ngInject */
    function ProsesPengembanganEdit($http, $state, $scope, $window, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $log, $timeout, AppFactory, Upload, ProsesPengembanganFactory) {
        var vm = this;
        var komentar;
        var id_dokumen;
        var id = $stateParams.id;
        var hideAddKomentar = false;
        vm.pegawaiInstansiId = null;

        vm.proses_pengembangan = {
            id: id,
            aduan: '',
            new_komentar: '',
            lokasi_dokumen: '',
            lokasi_dokumen_lampiran: '',
            keterangan_lampiran: '',
            lampiran: '',
            id_dokumen: '',
            penanggung_jawab: '',
            kategori: '',
            penyelesaian: '',
            type: '',
        };

        vm.proses_pengembangan.c_aduan_lampiran = [];
        vm.proses_pengembangan.c_aduan_komentar = [];

        ProsesPengembanganFactory.getProsesPengembangan(id).then(function (res) {
            angular.copy(res.data.data, vm.proses_pengembangan);
            angular.copy(vm.proses_pengembangan.c_aduan_komentar, vm.komentar);
            vm.komentar = vm.proses_pengembangan.c_aduan_komentar;
            vm.proses_pengembangan.new_komentar = '';
            vm.searchTextPegawai = vm.proses_pengembangan.penanggung_jawab;
            vm.searchText = vm.proses_pengembangan.kategori;
            vm.proses_pengembangan.hideAddKomentar = false;
            vm.proses_pengembangan.disableField = true;

            // cek reviewer hide komen dan disable field
            if (vm.proses_pengembangan.penanggung_jawab == '' || _.isNull(vm.proses_pengembangan.penanggung_jawab)) {
                vm.proses_pengembangan.disableField = false;
                vm.proses_pengembangan.hideAddKomentar = false;
            } else if (vm.proses_pengembangan.penanggung_jawab_status) {
                vm.proses_pengembangan.disableField = false;
                vm.proses_pengembangan.hideAddKomentar = false;
            } else if (vm.proses_pengembangan.reviewer) {
                vm.proses_pengembangan.hideAddKomentar = false;
            } else {
                vm.proses_pengembangan.disableField = false;
            }

            if (vm.proses_pengembangan.status == 'close') {
                vm.proses_pengembangan.hideAddKomentar = true;
            }

            if (vm.proses_pengembangan.c_aduan_lampiran.length > 0) {
                vm.proses_pengembangan.keterangan_lampiran = vm.proses_pengembangan.c_aduan_lampiran[0].keterangan;
                vm.proses_pengembangan.lokasi_dokumen_lampiran = vm.proses_pengembangan.c_aduan_lampiran[0].file_lampiran;
                id_dokumen = vm.proses_pengembangan.c_aduan_lampiran[0].id;
            }
        });

        vm.showDokumen = showDokumen;

        function showDokumen(lokasi) {
            $log.info('Opening Dokumen Dialog');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                    controller: ProsesPengembanganDialogController,
                    templateUrl: 'app/proses-pengembangan-module/proses-pengembangan-dialog.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen,
                    locals: {
                        dokumen: lokasi
                    }
                })
                .then(function () {}, function () {});
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /*** BEGIN - Autocomplete for Pegawai ***/
        vm.selectedItemPegawai = null;
        vm.searchTextPegawai = null;
        vm.querySearchPegawai = ProsesPengembanganFactory.querySearchPegawai;
        vm.isDisabledPegawai = false;
        vm.noCachePegawai = true;
        vm.selectedItemChangePegawai = selectedItemChangePegawai;

        function selectedItemChangePegawai(item) {
            if (angular.isDefined(item)) {
                vm.proses_pengembangan.penanggung_jawab = item.nama;
                vm.pegawaiInstansiId = item.instansi_id;
            } else {
                vm.pengguna.pegawai_id = null;
            }
        }
        /*** END - Autocomplete for Pegawai ***/

        /*** BEGIN - Autocomplete for Kategori ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = ProsesPengembanganFactory.querySearchKategori;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChange;

        function selectedItemChange(item) {
            if (angular.isDefined(item)) {
                vm.proses_pengembangan.kategori = item.path;
            } else {
                vm.proses_pengembangan.kategori = null;
            }
        }
        /*** END - Autocomplete for Kategori ***/

        vm.updateAction = updateAction;
        vm.cancelAction = ProsesPengembanganFactory.cancelAction;
        vm.downloadFile = downloadFile;
        vm.downloadFileKomentar = downloadFileKomentar;

        function cancelAction() {
            $state.go('triangular.admin-default.proses-pengembangan');
        }

        function downloadFile() {
            try {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'caduan/downloadFile/' + id_dokumen,
                    transformResponse: undefined, // do not parse as JSON
                    responseType: 'arraybuffer'
                };

                return $http(req)
                    .success(function (res, status, headers) {
                        var parsedStream = AppFactory.parseFileStream(res, status, headers);
                        saveAs(parsedStream.blob, parsedStream.name);
                    })
                    .error(function (data) {
                        var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                        var obj = angular.fromJson(decodedString);
                        if (obj.message) {
                            AppFactory.showToast(obj.message, 'error', obj.errors);
                        }
                    });
            } catch (ex) {
                AppFactory.showToast(ex, 'error');
            }
        }

        function downloadFileKomentar(id_lampiran_komentar) {
            try {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'caduan/downloadFileKomentar/' + id_lampiran_komentar,
                    transformResponse: undefined, // do not parse as JSON
                    responseType: 'arraybuffer'
                };

                return $http(req)
                    .success(function (res, status, headers) {
                        var parsedStream = AppFactory.parseFileStream(res, status, headers);
                        saveAs(parsedStream.blob, parsedStream.name);
                    })
                    .error(function (data) {
                        var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                        var obj = angular.fromJson(decodedString);
                        if (obj.message) {
                            AppFactory.showToast(obj.message, 'error', obj.errors);
                        }
                    });
            } catch (ex) {
                AppFactory.showToast(ex, 'error');
            }
        }

        /** BEGIN - File Upload **/
        vm.upload_status = 'idle'; // idle | uploading | complete
        vm.upload = upload;
        var fileList;

        function upload($files, $flag) {
            if ($files !== null && $files.length > 0) {
                fileList = $files;
                uploadStarted();
                Upload.upload({
                    url: EnvironmentConfig.api + 'DokumenPemohon/upload',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.message);
                    if ($flag == 'lampiran') {
                        vm.proses_pengembangan.lokasi_dokumen_lampiran = resp.data.data.file_name;
                    } else {
                        vm.proses_pengembangan.lokasi_dokumen_komentar = resp.data.data.file_name;
                    }
                    uploadComplete();
                }, function (resp) {
                    $log.error('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }

        function uploadStarted() {
            vm.upload_status = 'uploading';
        }

        function uploadComplete() {
            vm.upload_status = 'complete';
            var message = 'Berhasil upload ';
            for (var file in fileList) {
                message += fileList[file].name + ' ';
            }
            AppFactory.showToast(message);

            $timeout(uploadReset, 3000);
        }

        function uploadReset() {
            vm.upload_status = 'idle';
        }
        /** END - File Upload **/

        function updateAction(id) {

            var keterangan_lampiran = '';
            var lokasi_dokumen_lampiran = '';

            if (angular.isDefined(vm.proses_pengembangan.lokasi_dokumen_lampiran)) {
                lokasi_dokumen_lampiran = vm.proses_pengembangan.lokasi_dokumen_lampiran;
            }

            if (angular.isDefined(vm.proses_pengembangan.keterangan_lampiran)) {
                keterangan_lampiran = vm.proses_pengembangan.keterangan_lampiran;
            }

            var reqData = {
                'id': id,
                'status': vm.proses_pengembangan.status,
                'lokasi_dokumen_lampiran': lokasi_dokumen_lampiran,
                'keterangan_lampiran': keterangan_lampiran,
                'penanggung_jawab': vm.proses_pengembangan.penanggung_jawab,
                'kategori': vm.proses_pengembangan.kategori,
                'type': vm.proses_pengembangan.type,
                'tgl_aduan': vm.proses_pengembangan.tgl_aduan
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'caduan/edit/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.proses-pengembangan');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        vm.saveKomentar = function (id) {
            var reqData = {
                'c_aduan_id': id,
                'data_labels': 'Label Komentar',
                'file_lampiran': vm.proses_pengembangan.lokasi_dokumen_komentar,
                'komentar': vm.proses_pengembangan.new_komentar,
                'pengguna': vm.proses_pengembangan.dibuat_oleh,
                'del': 0
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'caduan/addKomentar/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    ProsesPengembanganFactory.getProsesPengembangan(id).then(function (res) {
                        angular.copy(res.data.data, vm.proses_pengembangan);
                        angular.copy(vm.proses_pengembangan.c_aduan_komentar, vm.komentar);
                        vm.komentar = vm.proses_pengembangan.c_aduan_komentar;
                        vm.proses_pengembangan.new_komentar = '';
                        vm.searchTextPegawai = vm.proses_pengembangan.penanggung_jawab;
                        vm.searchText = vm.proses_pengembangan.kategori;

                        if (vm.proses_pengembangan.c_aduan_lampiran.length > 0) {
                            vm.proses_pengembangan.keterangan_lampiran = vm.proses_pengembangan.c_aduan_lampiran[0].keterangan;
                            vm.proses_pengembangan.lokasi_dokumen_lampiran = vm.proses_pengembangan.c_aduan_lampiran[0].file_lampiran;
                            id_dokumen = vm.proses_pengembangan.c_aduan_lampiran[0].id;
                        }
                    });
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        };
    }
})();

function ProsesPengembanganDialogController(
    $state, $scope, $mdDialog, $http, EnvironmentConfig, dokumen
) {

    var type = dokumen.substr(-4);
    var filename = dokumen.split('dokumen_pemohon');

    $scope.tipe = type;
    $scope.url = EnvironmentConfig.api.replace('api/', '') + 'files/dokumen_pemohon/' + filename[0];

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
