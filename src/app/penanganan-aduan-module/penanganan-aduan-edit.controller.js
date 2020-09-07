(function () {
    'use strict';

    angular
        .module('penanganan-aduan-module')
        .controller('PenangananAduanEdit', PenangananAduanEdit);

    /* @ngInject */
    function PenangananAduanEdit($http, $state, $scope, $window, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $log, $timeout, AppFactory, Upload, PenangananAduanFactory) {
        var vm = this;
        var komentar;
        var id_dokumen;
        var id = $stateParams.id;
        vm.pegawaiInstansiId = null;
        vm.penanganan_aduan = {
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

        vm.penanganan_aduan.c_aduan_lampiran = [];
        vm.penanganan_aduan.c_aduan_komentar = [];

        PenangananAduanFactory.getPenangananAduan(id).then(function (res) {
            angular.copy(res.data.data, vm.penanganan_aduan);
            angular.copy(vm.penanganan_aduan.c_aduan_komentar, vm.komentar);
            vm.komentar = vm.penanganan_aduan.c_aduan_komentar;
            vm.penanganan_aduan.new_komentar = '';
            vm.searchTextPegawai = vm.penanganan_aduan.penanggung_jawab;
            vm.searchText = vm.penanganan_aduan.kategori;
            vm.penanganan_aduan.hideAddKomentar = false;
            vm.penanganan_aduan.disableField = true;

            // cek reviewer hide komen dan disable field
            if (vm.penanganan_aduan.penanggung_jawab == '' || _.isNull(vm.penanganan_aduan.penanggung_jawab)) {
                vm.penanganan_aduan.disableField = false;
                vm.penanganan_aduan.hideAddKomentar = false;
            } else if (vm.penanganan_aduan.penanggung_jawab_status) {
                vm.penanganan_aduan.disableField = false;
                vm.penanganan_aduan.hideAddKomentar = false;
            } else if (vm.penanganan_aduan.reviewer) {
                vm.penanganan_aduan.hideAddKomentar = false;
            } else {
                vm.penanganan_aduan.disableField = false;
            }

            if (vm.penanganan_aduan.status == 'close') {
                vm.penanganan_aduan.hideAddKomentar = true;
            }

            if (vm.penanganan_aduan.c_aduan_lampiran.length > 0) {
                vm.penanganan_aduan.keterangan_lampiran = vm.penanganan_aduan.c_aduan_lampiran[0].keterangan;
                vm.penanganan_aduan.lokasi_dokumen_lampiran = vm.penanganan_aduan.c_aduan_lampiran[0].file_lampiran;
                id_dokumen = vm.penanganan_aduan.c_aduan_lampiran[0].id;
            }
        });

        vm.showDokumen = showDokumen;

        function showDokumen(lokasi) {
            $log.info('Opening Dokumen Dialog');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                    controller: PenangananAduanDialogController,
                    templateUrl: 'app/penanganan-aduan-module/penanganan-aduan-dialog.tmpl.html',
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
        vm.querySearchPegawai = PenangananAduanFactory.querySearchPegawai;
        vm.isDisabledPegawai = false;
        vm.noCachePegawai = true;
        vm.selectedItemChangePegawai = selectedItemChangePegawai;

        function selectedItemChangePegawai(item) {
            if (angular.isDefined(item)) {
                vm.penanganan_aduan.penanggung_jawab = item.nama;
                vm.pegawaiInstansiId = item.instansi_id;
            } else {
                vm.pengguna.pegawai_id = null;
            }
        }
        /*** END - Autocomplete for Pegawai ***/

        /*** BEGIN - Autocomplete for Kategori ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = PenangananAduanFactory.querySearchKategori;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChange;

        function selectedItemChange(item) {
            if (angular.isDefined(item)) {
                vm.penanganan_aduan.kategori = item.path;
            } else {
                vm.penanganan_aduan.kategori = null;
            }
        }
        /*** END - Autocomplete for Kategori ***/

        vm.updateAction = updateAction;
        vm.cancelAction = PenangananAduanFactory.cancelAction;
        vm.downloadFile = downloadFile;
        vm.downloadFileKomentar = downloadFileKomentar;

        function cancelAction() {
            $state.go('triangular.admin-default.penanganan-aduan');
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
                        vm.penanganan_aduan.lokasi_dokumen_lampiran = resp.data.data.file_name;
                    } else {
                        vm.penanganan_aduan.lokasi_dokumen_komentar = resp.data.data.file_name;
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

            if (angular.isDefined(vm.penanganan_aduan.lokasi_dokumen_lampiran)) {
                lokasi_dokumen_lampiran = vm.penanganan_aduan.lokasi_dokumen_lampiran;
            }

            if (angular.isDefined(vm.penanganan_aduan.keterangan_lampiran)) {
                keterangan_lampiran = vm.penanganan_aduan.keterangan_lampiran;
            }

            var reqData = {
                'id': id,
                'status': vm.penanganan_aduan.status,
                'lokasi_dokumen_lampiran': lokasi_dokumen_lampiran,
                'keterangan_lampiran': keterangan_lampiran,
                'penanggung_jawab': vm.penanganan_aduan.penanggung_jawab,
                'kategori': vm.penanganan_aduan.kategori,
                'type': vm.penanganan_aduan.type,
                'tgl_aduan': vm.penanganan_aduan.tgl_aduan,
                'penyelesaian': vm.penanganan_aduan.penyelesaian
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
                    $state.go('triangular.admin-default.penanganan-aduan');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        vm.saveKomentar = function (id) {
            var reqData = {
                'c_aduan_id': id,
                'data_labels': 'Label Komentar',
                'file_lampiran': vm.penanganan_aduan.lokasi_dokumen_komentar,
                'komentar': vm.penanganan_aduan.new_komentar,
                'pengguna': vm.penanganan_aduan.dibuat_oleh,
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
                    PenangananAduanFactory.getPenangananAduan(id).then(function (res) {
                        angular.copy(res.data.data, vm.penanganan_aduan);
                        angular.copy(vm.penanganan_aduan.c_aduan_komentar, vm.komentar);
                        vm.komentar = vm.penanganan_aduan.c_aduan_komentar;
                        vm.penanganan_aduan.new_komentar = '';
                        vm.searchTextPegawai = vm.penanganan_aduan.penanggung_jawab;
                        vm.searchText = vm.penanganan_aduan.kategori;

                        if (vm.penanganan_aduan.c_aduan_lampiran.length > 0) {
                            vm.penanganan_aduan.keterangan_lampiran = vm.penanganan_aduan.c_aduan_lampiran[0].keterangan;
                            vm.penanganan_aduan.lokasi_dokumen_lampiran = vm.penanganan_aduan.c_aduan_lampiran[0].file_lampiran;
                            id_dokumen = vm.penanganan_aduan.c_aduan_lampiran[0].id;
                        }
                    });
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        };
    }
})();

function PenangananAduanDialogController(
    $state, $scope, $mdDialog, $http, EnvironmentConfig, dokumen, PenangananAduanFactory
) {

    var type = dokumen.substr(-4);
    var filename = dokumen.split("dokumen_pemohon");

    $scope.tipe = type;
    $scope.url = EnvironmentConfig.api.replace('api/', '') + 'files/dokumen_pemohon/' + filename[0];

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
