(function() {
    'use strict';

    angular
        .module('app.admin.authentication')
        .controller('RegisterController', RegisterController);

    /* @ngInject */
    function RegisterController(
        $state, $http, $log, $scope,
        triSettings, EnvironmentConfig, APP_CONFIG, Upload,
        AppFactory, PermohonanIzinFactory, UnitFactory, usernameFilter
    ) {
        // protect this page if register pemohon is not allowed
        if (!EnvironmentConfig.showRegisterPemohon) {
            $state.go('authentication.login');
        }

        var vm = this;
        vm.pemohon = {
            tipe_identitas: null,
            no_identitas: null,
            nama: null,
            username: null,
            email: null,
            tempat_lahir: null,
            tgl_lahir: null,
            alamat: null,
            provinsi_id: null,
            kabupaten_id: null,
            kecamatan_id: null,
            desa_id: null,
            instansi_id: null
        };
        vm.genderList = [];
        vm.jenisIdentitasList = [];

        vm.triSettings = triSettings;
        vm.registerClick = registerClick;
        vm.usernameChange = usernameChange;
        vm.querySearchDesa = PermohonanIzinFactory.querySearchDesa;
        vm.selectedItemChangeDesa = selectedItemChangeDesa;
        vm.querySearchKecamatan = PermohonanIzinFactory.querySearchKecamatan;
        vm.selectedItemChangeKecamatan = selectedItemChangeKecamatan;
        vm.querySearchKabupaten = PermohonanIzinFactory.querySearchKabupaten;
        vm.selectedItemChangeKabupaten = selectedItemChangeKabupaten;
        vm.querySearchProvinsi = PermohonanIzinFactory.querySearchProvinsi;
        vm.selectedItemChangeProvinsi = selectedItemChangeProvinsi;
        vm.maxBirthDate = AppFactory.getMaxBirthDate();

        PermohonanIzinFactory.getGenderList().then(function (res) {
            vm.genderList = res.data.data.items;

            PermohonanIzinFactory.getJenisIdentitasList().then(function (res) {
                vm.jenisIdentitasList = res.data.data.items;
            });
        });

        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItemInstansi       = null;
        vm.searchTextInstansi         = null;
        vm.querySearchInstansi        = UnitFactory.querySearchInstansiPublic;
        vm.isDisabledInstansi         = false;
        vm.noCacheInstansi            = true;
        vm.selectedItemChangeInstansi = selectedItemChangeInstansi;

        function selectedItemChangeInstansi(item) {
            if (angular.isDefined(item)) {
                vm.pemohon.instansi_id = item.id;
            } else {
                vm.pemohon.instansi_id = null;
            }
        }
        /*** END - Autocomplete for Instansi ***/

        ////////////////

        function registerClick() {
            var reqData = AppFactory.clone(vm.pemohon);
            // Format date before posting
            if (reqData.tgl_lahir instanceof Date) {
                reqData.tgl_lahir = moment(reqData.tgl_lahir).format(APP_CONFIG.datepickerFormat);
            }

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pemohon/register',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $scope.triWizard.currentStep = 3;
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function usernameChange() {
            vm.pemohon.username = usernameFilter(vm.pemohon.username);
        }

        function selectedItemChangeProvinsi(item) {
            if (angular.isDefined(item)) {
                vm.pemohon.provinsi_id = item.id;
                vm.searchTextProvinsi = item.nama_daerah;
            } else {
                vm.pemohon.provinsi_id = null;
                vm.searchTextProvinsi = null;
            }
        }

        function selectedItemChangeKabupaten(item) {
            if (angular.isDefined(item)) {
                vm.pemohon.kabupaten_id = item.id;
                vm.searchTextKabupaten = item.nama_daerah;
            } else {
                vm.pemohon.kabupaten_id = null;
                vm.searchTextKabupaten = null;
            }
        }

        function selectedItemChangeKecamatan(item) {
            if (angular.isDefined(item)) {
                vm.pemohon.kecamatan_id = item.id;
                vm.searchTextKecamatan = item.nama_daerah;
            } else {
                vm.pemohon.kecamatan_id = null;
                vm.searchTextKecamatan = null;
            }
        }

        function selectedItemChangeDesa(item) {
            if (angular.isDefined(item)) {
                vm.pemohon.desa_id = item.id;
                vm.searchTextDesa = item.nama_daerah;
            } else {
                vm.pemohon.desa_id = null;
                vm.searchTextDesa = null;
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

                Upload.upload({
                    url: EnvironmentConfig.api + 'Pemohon/upload',
                    data: { file: fileList }
                }).then(function(resp) {
                    $log.info('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.message);
                    vm.pemohon.file_dokumen = resp.data.data.file_name;
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
    }
})();