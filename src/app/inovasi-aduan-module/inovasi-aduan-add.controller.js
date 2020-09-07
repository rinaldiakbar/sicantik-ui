(function () {
    'use strict';

    angular
        .module('inovasi-aduan-module')
        .controller('InovasiAduanAddController', InovasiAduanAddController);

    /* @ngInject */
    function InovasiAduanAddController(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $document,
        $scope, $log, $timeout, AppFactory, InovasiAduanFactory, Upload, _
    ) {
        var vm = this;
        vm.data  = {};
        vm.aduan = {};
        vm.aduan.c_aduan_lampiran = [];
        vm.aduan.tgl_aduan = new Date();

        InovasiAduanFactory.getFormatNumber().then(function (res) {
            vm.result = res.data.data;
            vm.aduan.del = 0;
            vm.aduan.no_tiket = vm.result.number;
        });

        /*** BEGIN - Main Form ***/
        var fileList;
        vm.upload_status = 'idle';
        vm.uploadFile = uploadFile;
        vm.downloadFile = downloadFile;
        vm.createAction = createAction;
        vm.cancelAction = InovasiAduanFactory.cancelAction;

        function uploadFile($files) {
            if (!_.isNull($files) && $files.length > 0) {
                fileList = $files;

                uploadStarted();

                Upload.upload({
                    url: EnvironmentConfig.api + 'caduan/uploadFile',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    vm.data.file_url = resp.data.data.file_url;
                    vm.data.file_lampiran = resp.data.data.file_name;
                    if (vm.aduan.c_aduan_lampiran.length == 0) {
                        vm.aduan.c_aduan_lampiran.push({
                            'del':0,
                            'file_lampiran': resp.data.data.file_name,
                            'keterangan':vm.data.keterangan
                        });
                    }
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

        function uploadReset() {
            vm.upload_status = 'idle';
        }

        function downloadFile(filename) {
            var url = filename;
            var a  = $document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.download = url;
            $document.body.appendChild(a);
            a.click();
        }

        function createAction() {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'caduan',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: vm.aduan
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.inovasi-aduan');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** End - Main Form ***/
    }
})();