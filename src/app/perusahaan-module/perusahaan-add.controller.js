(function () {
    'use strict';

    angular
        .module('perusahaan-module')
        .controller('PerusahaanAddController', PerusahaanAddController);

    /* @ngInject */
    function PerusahaanAddController(
        $http, $state, EnvironmentConfig, ElementConfig,
        AppFactory, PerusahaanFactory, $mdDialog, $mdToast, $log,
        $timeout, Upload, PemegangSahamFactory, _
    ) {
        var vm = this;
        var fileList;

        vm.perusahaan = {};
        vm.perusahaan.c_perusahaan_saham = [];
        vm.perusahaan.c_pemegang_saham = [];
        vm.upload_status = 'idle';
        vm.uploadFile = uploadFile;
        vm.createAction = createAction;
        vm.cancelAction = cancelAction;

        function uploadFile($files, data) {
            if (!_.isNull($files) && $files.length > 0) {
                fileList = $files;

                uploadStarted(data);

                Upload.upload({
                    url: EnvironmentConfig.api + 'cpersonal/uploadFile',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.data.data.file_name + ' uploaded. Response: ' + resp.data.message);
                    data.data = resp.data.data.file_name;
                    data.file_url = resp.data.data.file_url;
                    vm.foto = resp.data.data.file_url;
                    vm.perusahaan.logo = resp.data.data.file_name;
                    uploadComplete(data);

                }, function (resp) { // Error Upload
                    $timeout(uploadReset(data), 3000);
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

        function uploadComplete(data) {
            vm.upload_status = 'complete';
            var message = 'Berhasil upload ';

            for (var file in fileList) {
                message += fileList[file].name + ' ';
            }

            AppFactory.showToast(message);
            $timeout(uploadReset(data), 3000);

            fileList = null;
        }

        function uploadReset() {
            vm.upload_status = 'idle';
        }

        function createAction() {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'cperusahaan/add',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: vm.perusahaan
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.perusahaan-newstructure');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.perusahaan-newstructure');
        }

        /*** BEGIN - Tab Pemegang Saham ***/
        vm.addNewPemegangSaham = function () {
            if (_.isNull(vm.perusahaan)) {
                vm.perusahaan = {};
                vm.perusahaan.c_perusahaan_saham = [];
                vm.perusahaan.c_pemegang_saham = [];
            }

            vm.perusahaan.c_perusahaan_saham.push({
                'c_pemegang_saham_id': null,
                'persentase': null
            });

            vm.perusahaan.c_pemegang_saham.push({
                'pemegang_saham': null
            });
        };

        vm.removePemegangSaham = function (index) {
            var dialog = {
                title: 'Apakah anda yakin?',
                content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                ok: 'Ya',
                cancel: 'Tidak'
            };

            $mdDialog.show(
                $mdDialog.confirm()
                    .title(dialog.title)
                    .textContent(dialog.content)
                    .ok(dialog.ok)
                    .cancel(dialog.cancel)
            ).then(function () {
                vm.perusahaan.c_perusahaan_saham.splice(index, 1);
            });
        };

        /*** BEGIN - Autocomplete for Pemegang Saham ***/
        vm.selectedItem = null;
        vm.searchText = [];
        vm.querySearchSaham = PemegangSahamFactory.querySearchSaham;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChange;

        function initPemegangSahamAutocomplete() {
            if (vm.perusahaan.c_perusahaan_saham.length != 0) {
                vm.perusahaan.c_perusahaan_saham.forEach(function (data, index) {
                    vm.searchText[index] = data.c_pemegang_saham.pemegang_saham;
                });
            }
        }

        function selectedItemChange(item, index) {
            if (angular.isDefined(item)) {
                vm.perusahaan.c_perusahaan_saham[index].c_pemegang_saham_id = item.id;
                vm.perusahaan.c_pemegang_saham[index].pemegang_saham = item.pemegang_saham;
            } else {
                vm.perusahaan.c_perusahaan_saham[index].c_pemegang_saham_id = null;
                vm.perusahaan.c_pemegang_saham[index].pemegang_saham = null;
            }
        }
        /*** END - Autocomplete for Pemegang Saham ***/
    }
})();
