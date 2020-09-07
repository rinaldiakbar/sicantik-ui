(function () {
    'use strict';

    angular
        .module('profile-pemohon-module')
        .controller('ProfilePemohonDokumenDetail', ProfilePemohonDokumenDetail);

    /* @ngInject */
    function ProfilePemohonDokumenDetail(
        $http, $state, $scope, $stateParams, $log, $timeout, EnvironmentConfig,
        AppFactory, ProfilePemohonFactory, Upload
    ) {
        var vm = this;
        var id = $stateParams.dokumen_pemohon_id;

        vm.dokumenProfilePemohon = {
            no_dokumen: null,
            jenis_dokumen_id: null,
            awal_berlaku: null,
            akhir_berlaku: null,
            lokasi_dokumen: null,
            permohonan_izin_id: vm.permohonan_id
        };
        vm.downloadFile = downloadFile;
        vm.backToProfilePemohonView = ProfilePemohonFactory.backToProfilePemohonView;

        ProfilePemohonFactory.getDokumenProfilePemohon(id).then(function (res) {
            angular.copy(res.data.data, vm.dokumenProfilePemohon);
            vm.dokumenProfilePemohon.tgl_dibuat = null;
            vm.dokumenProfilePemohon.tgl_diubah = null;
        });

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
                    vm.dokumenProfilePemohon.lokasi_dokumen = resp.data.data.file_name;
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
            var reqData = AppFactory.clone(vm.dokumenProfilePemohon);
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
                        $state.go('triangular.admin-default.profile-pemohon-view');
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
