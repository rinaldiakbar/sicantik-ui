(function () {
    'use strict';

    angular
        .module('aduan-module')
        .controller('AduanView', AduanView);

    /* @ngInject */
    function AduanView(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia,
        $scope, $log, $timeout, AppFactory, AduanFactory, Upload
    ) {
        var vm = this;
        var id = $stateParams.id;

        AduanFactory.getAduan(id).then(function (res) {
            vm.aduan = res.data.data;
        });

        /*** BEGIN - Main Form ***/
        var fileList;
        vm.upload_status = 'idle';
        vm.uploadFile = uploadFile;
        vm.downloadFile = downloadFile;
        vm.downloadFileKomentar = downloadFileKomentar;
        vm.showDokumen  = showDokumen;
        vm.saveKomentar = saveKomentar;
        vm.cancelAction = AduanFactory.cancelAction;

        function uploadFile($files, data) {
            if (!_.isNull($files) && $files.length > 0) {
                fileList = $files;

                uploadStarted();

                Upload.upload({
                    url: EnvironmentConfig.api + 'caduan/uploadFile',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.data.data.file_name + ' uploaded. Response: ' + resp.data.message);
                    vm.aduan.file_url = resp.data.data.file_url;
                    vm.aduan.file_lampiran = resp.data.data.file_name;
                    uploadComplete();

                }, function (resp) { // Error Upload
                    $timeout(uploadReset(), 3000);
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
            $timeout(uploadReset(), 3000);

            fileList = null;
        }

        function uploadReset(data) {
            vm.upload_status = 'idle';
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

        function showDokumen(filename, jenis) {
            $log.info('Opening Dokumen Dialog');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: DokumenDialogController,
                templateUrl: 'app/aduan-module/aduan-dialog.tmpl.html',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: { dokumen: filename, target: jenis }
            })
                .then(function () {
                    // $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    // $scope.status = 'You cancelled the dialog.';
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
                'file_lampiran' : vm.aduan.file_lampiran,
                'komentar' : vm.aduan.new_komentar,
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
        /*** End - Main Form ***/
    }
})();

function DokumenDialogController(
    $state, $scope, $log, $mdDialog, $http, EnvironmentConfig, dokumen, target
) {
    var type = dokumen.substr(-4);
    $scope.tipe = type;
    $scope.url  = EnvironmentConfig.api.replace('api/', '') + 'files/upload/' + dokumen;

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}