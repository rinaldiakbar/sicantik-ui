(function() {
    'use strict';

    angular
        .module('proses-pengembangan-module')
        .controller('ProsesPengembanganView', ProsesPengembanganView);

    /* @ngInject */
    function ProsesPengembanganView($http, $state, EnvironmentConfig, $stateParams, $log, $timeout, AppFactory, Upload,ProsesPengembanganFactory) {
        var vm = this;
        var komentar;
        var id_dokumen;
        var id = $stateParams.id;
        vm.penanganan_aduan = {
            id: id,
            aduan: '',
            new_komentar: '',
            lokasi_dokumen: '',
            lokasi_dokumen_lampiran: '',
            keterangan_lampiran: '',
            lampiran: '',
            id_dokumen: ''
        };

        ProsesPengembanganFactory.getProsesPengembangan(id).then(function (res) {
            angular.copy(res.data.data, vm.penanganan_aduan);
            angular.copy(vm.penanganan_aduan.c_aduan_komentar, vm.komentar);
            vm.komentar = vm.penanganan_aduan.c_aduan_komentar;
            vm.penanganan_aduan.new_komentar = '';
            console.log(vm.komentar);
            
            if(vm.penanganan_aduan.c_aduan_lampiran.length>0){
                vm.penanganan_aduan.keterangan_lampiran = vm.penanganan_aduan.c_aduan_lampiran[0].keterangan;
                vm.penanganan_aduan.lokasi_dokumen = vm.penanganan_aduan.c_aduan_lampiran[0].file_lampiran;
                id_dokumen = vm.penanganan_aduan.c_aduan_lampiran[0].id;
            }
        });

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

                // $timeout(uploadComplete, 4000);

                Upload.upload({
                    url: EnvironmentConfig.api + 'DokumenPemohon/upload',
                    data: { file: fileList }
                }).then(function(resp) {
                    $log.info('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.message);
                    if($flag == 'lampiran'){
                        vm.penanganan_aduan.lokasi_dokumen = resp.data.data.file_name;
                    }else{
                        vm.penanganan_aduan.lokasi_dokumen_lampiran = resp.data.data.file_name;
                    }
                    
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


        function updateAction(id) {
            // var reqData = vm.penanganan_aduan;

            var reqData = {
                'id' : id,
                'status' : vm.penanganan_aduan.status,
                'lampiran' : vm.penanganan_aduan.lokasi_dokumen,
                'keterangan_lampiran' : vm.penanganan_aduan.keterangan_lampiran
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'caduan/edit/' +id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.proses-pengembangan');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        vm.saveKomentar = function(id) {
            var reqData = {
                'c_aduan_id' : id,
                'instansi_id' : vm.penanganan_aduan.instansi_id,
                'data_labels' : 'Label Komentar',
                'dibuat_oleh' : vm.penanganan_aduan.dibuat_oleh,
                'file_lampiran' : vm.penanganan_aduan.lokasi_dokumen_lampiran,
                'komentar' : vm.penanganan_aduan.new_komentar,
                'pengguna' : vm.penanganan_aduan.dibuat_oleh,
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
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        };
    }
})();
