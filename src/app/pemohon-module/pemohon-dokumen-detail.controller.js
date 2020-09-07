(function() {
    'use strict';

    angular
        .module('pemohon-module')
        .controller('PemohonDokumenDetailController', PemohonDokumenDetailController);

    /* @ngInject */
    function PemohonDokumenDetailController(
        $http, $state, $scope, $stateParams, $log, $timeout,
        EnvironmentConfig, AppFactory, Upload, PemohonFactory
    ) {
        var vm = this;
        var id = $stateParams.dokumen_pemohon_id;
        var keyId = $stateParams.key_id;

        vm.key_id = keyId;
        vm.dokumenPemohon = {};
        vm.downloadFile = downloadFile;
        vm.backToPemohonView = cancelAction;

        vm.dokumen_pemohon = {
            id: null,
            no_dokumen: null,
            jenis_dokumen_id: null,
            awal_berlaku: null,
            akhir_berlaku: null,
            lokasi_dokumen: null,
            pemohon_id: vm.key_id,
            permohonan_izin_id: vm.permohonan_izin_id
        };

        PemohonFactory.getDokumenPemohon(id).then(function (res) {
            angular.copy(res.data.data, vm.dokumenPemohon);
            vm.key_id = vm.dokumenPemohon.key_id;
            vm.dokumen_pemohon = vm.dokumenPemohon;
            vm.dokumen_pemohon.tgl_dibuat = null;
            vm.dokumen_pemohon.tgl_diubah = null;
        });

        function cancelAction() {
            if (angular.isDefined($stateParams.permohonan_id)) {
                $state.go('triangular.admin-default.permohonan-izin-edit', {'permohonan_id': $stateParams.permohonan_id});
            } else {
                PemohonFactory.backToPemohonView($stateParams.key_id);
            }
        }

        function downloadFile() {
            try {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'DokumenPemohon/downloadFile/' + id,
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
            if ($files !== null && $files.length > 0) {
                fileList = $files;

                uploadStarted();

                // $timeout(uploadComplete, 4000);

                Upload.upload({
                    url: EnvironmentConfig.api + 'DokumenPemohon/upload',
                    data: { file: fileList }
                }).then(function(resp) {
                    $log.info('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.message);
                    vm.dokumen_pemohon.lokasi_dokumen = resp.data.data.file_name;
                    uploadComplete();
                }, function(resp) {
                    $log.error('Error status: ' + resp.status);
                }, function(evt) {
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

        vm.createAction = createAction;

        function createAction() {
            var reqData = AppFactory.clone(vm.dokumen_pemohon);
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'dokumen_pemohon/' +id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function(res) {
                    // console.log($stateParams);
                    AppFactory.showToast(res.message);
                    if (angular.isDefined($stateParams.permohonan_id)) {
                        $state.go('triangular.admin-default.permohonan-izin-edit', {'permohonan_id': $stateParams.permohonan_id});
                    } else {
                        $state.go('triangular.admin-default.pemohon-view', {'key_id': $stateParams.key_id});
                    }
                })
                .error(function(err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }
    }
})();
