(function () {
    'use strict';

    angular
        .module('pengumuman-module')
        .controller('PengumumanAddController', PengumumanAddController);

    /* @ngInject */
    function PengumumanAddController(
        $http, $state, $timeout, EnvironmentConfig, $log, Upload, AppFactory, PengumumanFactory, _
    ) {
        var vm = this;
        vm.pesan = {
            judul: null,
            pesan: null,
            file_lampiran: null
        };

        vm.createAction = createAction;
        vm.cancelAction = PengumumanFactory.cancelAction;
        vm.downloadFile = downloadFile;

        function createAction() {
            var reqData = {
                'judul': vm.pesan.judul,
                'pesan': vm.pesan.pesan,
                'file_lampiran': vm.pesan.file_lampiran,
                'tipe': 'announcement'
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pesan',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.pengumuman');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function downloadFile(downloadUrl) {
            try {
                var req = {
                    method: 'GET',
                    url: downloadUrl,
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

        function upload($files) {
            if (!_.isNull($files) && $files.length > 0) {
                fileList = $files;

                uploadStarted();

                // $timeout(uploadComplete, 4000);

                Upload.upload({
                    url: EnvironmentConfig.api + 'Pesan/upload',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.message);
                    vm.pesan.file_lampiran = resp.data.data.file_name;
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
    }
})();
