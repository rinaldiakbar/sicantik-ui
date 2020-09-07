(function () {
    'use strict';

    angular
        .module('aduan-module')
        .controller('AduanEdit', AduanEdit);

    /* @ngInject */
    function AduanEdit(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia,
        $scope, $log, $timeout, AppFactory, AduanFactory, Upload
    ) {
        var vm = this;
        var id = $stateParams.id;

        AduanFactory.getAduan(id).then(function (res) {
            vm.data  = {};
            vm.data.new_komentar = null;
            vm.data.file_lampiran_komentar = null;
            vm.data.file_url_lampiran = null;
            vm.data.file_url_lampiran_komentar = null;
            vm.aduan = res.data.data;
            if (!_.isNull(vm.aduan)) {
                initKategoriAutocomplete();
                vm.aduan.tgl_aduan = new Date(vm.aduan.tgl_aduan);
            }
        });

        /*** BEGIN - Main Form ***/
        var fileList;
        vm.upload_status = 'idle';
        vm.upload_status2 = 'idle';
        vm.uploadFile = uploadFile;
        vm.downloadFile = downloadFile;
        vm.updateAction = updateAction;
        vm.showDokumen  = showDokumen;
        vm.saveKomentar = saveKomentar;
        vm.cancelAction = AduanFactory.cancelAction;

        function uploadFile($files, $flag) {
            if (!_.isNull($files) && $files.length > 0) {
                fileList = $files;

                uploadStarted($flag);

                Upload.upload({
                    url: EnvironmentConfig.api + 'caduan/uploadFile',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.data.data.file_name + ' uploaded. Response: ' + resp.data.message);
                    if($flag == 'lampiran'){
                        vm.data.file_url_lampiran = resp.data.data.file_url;
                        vm.aduan.c_aduan_lampiran[0].file_lampiran = resp.data.data.file_name;
                        vm.aduan.c_aduan_lampiran[0].del = 0;
                    }else{
                        vm.data.file_lampiran_komentar = resp.data.data.file_name;
                        vm.data.file_url_lampiran_komentar = resp.data.data.file_url;
                    }
                    uploadComplete($flag);

                }, function (resp) { // Error Upload
                    $timeout(uploadReset($flag), 3000);
                    $log.info('Error status: ' + resp.status);

                    var errorMessage = 'Terjadi kesalahan saat upload data. Mohon periksa setting server.';
                    if (resp.data && resp.data.message) {
                        errorMessage = resp.data.message;
                    }
                    AppFactory.showToast(errorMessage);

                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }

        function uploadStarted(tipe) {
            if (tipe == 'lampiran') {
                vm.upload_status = 'uploading';
            } else {
                vm.upload_status2 = 'uploading';
            }
        }

        function uploadComplete(tipe) {
            if (tipe == 'lampiran') {
                vm.upload_status = 'complete';
            } else {
                vm.upload_status2 = 'complete';
            }
            var message = 'Berhasil upload ';

            for (var file in fileList) {
                message += fileList[file].name + ' ';
            }

            AppFactory.showToast(message);
            $timeout(uploadReset(tipe), 3000);

            fileList = null;
        }

        function uploadReset(tipe) {
            if (tipe == 'lampiran') {
                vm.upload_status = 'idle';
            } else {
                vm.upload_status2 = 'idle';
            }
        }

        function downloadFile(filename, jenis) {
            var url = filename;
            if (jenis != '') {
                var url = EnvironmentConfig.api.replace('api/', '') + 'webroot/files/upload/' + filename;
            }
            var a  = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.download = url;
            document.body.appendChild(a);
            a.click();
        }

        function updateAction() {
            if (!_.isNull(vm.data.new_komentar)) {
                vm.aduan.c_aduan_komentar.push({
                    'c_aduan_id'  : vm.aduan.id,
                    'instansi_id' : vm.aduan.instansi_id,
                    'data_labels' : 'Label Komentar',
                    'tgl_dibuat'  : new Date(),
                    'dibuat_oleh' : vm.aduan.dibuat_oleh,
                    'pengguna' : vm.aduan.dibuat_oleh,
                    'komentar' : vm.data.new_komentar,
                    'file_lampiran' : vm.data.file_lampiran_komentar,
                    'del' :0
                });
            }

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'caduan/editAduan/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: vm.aduan
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.aduan');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function showDokumen(lokasi) {
            $log.info('Opening Dokumen Dialog');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: AduanDialogController,
                templateUrl: 'app/aduan-module/aduan-dialog.tmpl.html',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: { file: lokasi }
            })
                .then(function () {
                }, function () {
                });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function saveKomentar(id) {
            var reqData = {
                'c_aduan_id' : id,
                'instansi_id' : vm.aduan.instansi_id,
                'data_labels' : 'Label Komentar',
                'dibuat_oleh' : vm.aduan.dibuat_oleh,
                'file_lampiran' : vm.data.file_lampiran_komentar,
                'komentar' : vm.data.new_komentar,
                'pengguna' : vm.aduan.dibuat_oleh,
                'del' :0
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
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.reload();
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for Kategori ***/
            vm.selectedItem = null;
            vm.searchText = null;
            vm.querySearch = AduanFactory.querySearchKategori;
            vm.isDisabled = false;
            vm.noCache = true;
            vm.selectedItemChange = selectedItemChange;

            function initKategoriAutocomplete() {
                if (!_.isNull(vm.aduan)) {
                    vm.searchText = vm.aduan.kategori;
                }
            }

            function selectedItemChange(item) {
                if (angular.isDefined(item)) {
                    vm.aduan.kategori = item.path;
                } else {
                    vm.aduan.kategori = null;
                }
            }
        /*** END - Autocomplete for Kategori ***/
        /*** End - Main Form ***/
    }
})();

function AduanDialogController(
    $state, $scope, $log, $mdDialog, $http, EnvironmentConfig, file
) {
    var type = file.substr(-4);
    $scope.tipe = type;
    $scope.url  = EnvironmentConfig.api.replace('api/', '') + 'files/upload/' + file;

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}