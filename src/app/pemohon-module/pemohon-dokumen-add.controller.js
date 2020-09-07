(function () {
    'use strict';

    angular
        .module('unit-module')
        .controller('PemohonDokumenAddController', PemohonDokumenAddController);

    /* @ngInject */
    function PemohonDokumenAddController(
        $http, $state, EnvironmentConfig, $stateParams, $log, $timeout, APP_CONFIG,
        AppFactory, PemohonFactory, $mdDialog, Upload, JenisDokumenFactory, PermohonanIzinFactory, _
    ) {
        var vm = this;

        vm.key_id = $stateParams.key_id; // Pemohon ID
        vm.disableChangeJenisDokumen = false;
        vm.searchTextJenisDokumen = '';
        vm.dokumen_pemohon = {
            no_dokumen: null,
            jenis_dokumen_id: null,
            awal_berlaku: null,
            akhir_berlaku: null,
            lokasi_dokumen: null,
            pemohon_id: vm.key_id,
            permohonan_izin_id: vm.permohonan_izin_id
        };

        if (angular.isDefined($stateParams.jenis_dokumen_id)) {
            vm.dokumen_pemohon.jenis_dokumen_id = $stateParams.jenis_dokumen_id;
            JenisDokumenFactory.getJenisDokumen(vm.dokumen_pemohon.jenis_dokumen_id).then(function (res) {
                vm.searchTextJenisDokumen = res.data.data.deskripsi;
                vm.dokumen_pemohon.jenis_dokumen_label = res.data.data.deskripsi;
                vm.disableChangeJenisDokumen = true;
            }, function() {
                vm.dokumen_pemohon.jenis_dokumen_id = null;
                vm.disableChangeJenisDokumen = false;
            });
        }

        if (angular.isDefined($stateParams.permohonan_id)) {
            vm.dokumen_pemohon.permohonan_izin_id = $stateParams.permohonan_id;
            // Get pre-filled data from persyaratan
            PermohonanIzinFactory.getPersyaratanByJenis(vm.dokumen_pemohon.permohonan_izin_id, vm.dokumen_pemohon.jenis_dokumen_id).then(function (res) {
                var persyaratan = res.data.data;
                vm.dokumen_pemohon.no_dokumen = persyaratan.no_dokumen;
                if (persyaratan.awal_berlaku) {
                    vm.dokumen_pemohon.awal_berlaku = moment(persyaratan.awal_berlaku, APP_CONFIG.datepickerFormat).toDate();
                }
                if (persyaratan.akhir_berlaku) {
                    vm.dokumen_pemohon.akhir_berlaku = moment(persyaratan.akhir_berlaku, APP_CONFIG.datepickerFormat).toDate();
                }
            });
        }

        vm.createAction = createAction;
        vm.backToPemohonView = cancelAction;

        function createAction() {
            var reqData = AppFactory.clone(vm.dokumen_pemohon);

            if (reqData.awal_berlaku instanceof Date) {
                reqData.awal_berlaku = moment(reqData.awal_berlaku).format(APP_CONFIG.datepickerFormat);
            }

            if (reqData.akhir_berlaku instanceof Date) {
                reqData.akhir_berlaku = moment(reqData.akhir_berlaku).format(APP_CONFIG.datepickerFormat);
            }

            if (angular.isDefined($stateParams.permohonan_id)) {
                reqData.permohonan_izin_id = $stateParams.permohonan_id;
            }

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'dokumen_pemohon/',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    if (angular.isDefined($stateParams.permohonan_id)) {
                        $state.go('triangular.admin-default.permohonan-izin-edit', {
                            'permohonan_id': $stateParams.permohonan_id
                        });
                    } else {
                        $state.go('triangular.admin-default.pemohon-view', {
                            'key_id': vm.key_id
                        });
                    }
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function cancelAction(keyId) {
            if (angular.isDefined($stateParams.permohonan_id)) {
                $state.go('triangular.admin-default.permohonan-izin-edit', {
                    'permohonan_id': $stateParams.permohonan_id
                });
            } else {
                PemohonFactory.backToPemohonView(keyId);
            }
        }

        /*** BEGIN - Autocomplete for Jenis Dokumen ***/
        vm.querySearchJenisDokumen = JenisDokumenFactory.querySearchJenisDokumen;
        vm.selectedItemChangeJenisDokumen = selectedItemChangeJenisDokumen;

        function selectedItemChangeJenisDokumen(item) {
            if (angular.isDefined(item)) {
                vm.dokumen_pemohon.jenis_dokumen_id = item.id;
                vm.dokumen_pemohon.jenis_dokumen_label = item.deskripsi;
            }
        }
        /*** END - Autocomplete for Parent Jenis Dokumen ***/


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
                    url: EnvironmentConfig.api + 'DokumenPemohon/upload',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.message);
                    vm.dokumen_pemohon.lokasi_dokumen = resp.data.data.file_name;
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