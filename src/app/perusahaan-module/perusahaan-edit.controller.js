(function () {
    'use strict';

    angular
        .module('perusahaan-module')
        .controller('PerusahaanEditController', PerusahaanEditController);

    /* @ngInject */
    function PerusahaanEditController(
        $http, $state, EnvironmentConfig, ElementConfig, $stateParams,
        AppFactory, PerusahaanFactory, $mdDialog, $mdToast, $log, 
        $timeout, Upload, DashboardFactory, PemegangSahamFactory, _
    ) {
        var vm = this;
        var id = $stateParams.id;
        var fileList;

        vm.perusahaan = {};
        vm.perusahaan.c_perusahaan_saham = [];
        vm.upload_status = 'idle';
        vm.uploadFile = uploadFile;
        vm.updateAction = updateAction;
        vm.cancelAction = cancelAction;

        PerusahaanFactory.getPerusahaan(id).then(function (res) {
            vm.perusahaan = res.data.data;
            if (!_.isNull(vm.perusahaan.c_perusahaan_saham)) {
                initPemegangSahamAutocomplete();
            }

            if (!_.isNull(vm.perusahaan.logo)) {
                vm.foto = EnvironmentConfig.api.replace('api/', '') + 'files/upload/' + vm.perusahaan.logo;
            }

            if (_.isNull(vm.perusahaan)) {
                vm.perusahaan = {};
                vm.perusahaan.c_perusahaan_saham = [];
            }
        }, function (err) {
            if (err.message) {
                AppFactory.showToast(err.message, 'error', err.errors);
            }
        });

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

        function updateAction() {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'cperusahaan/edit/' + id,
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
            }

            vm.perusahaan.c_perusahaan_saham.push({
                'c_perusahaan_id': vm.perusahaan.id,
                'c_pemegang_saham_id': null,
                'persentase': null
            });
        };

        vm.removePemegangSaham = function (index) {
            if (angular.isDefined(vm.perusahaan.c_perusahaan_saham[index].id)) {
                var psId = vm.perusahaan.c_perusahaan_saham[index].id;
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
                    PerusahaanFactory.deletePerusahaanSaham(psId).then(function () {
                        vm.perusahaan.c_perusahaan_saham.splice(index, 1);
                    });
                });

            } else {
                vm.perusahaan.c_perusahaan_saham.splice(index, 1);
            }
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
            } else {
                vm.perusahaan.c_perusahaan_saham[index].c_pemegang_saham_id = null;
            }
        }
        /*** END - Autocomplete for Pemegang Saham ***/
        /*** END - Pemegang Saham ***/

        //Data chart saham
        vm.saham = {
            type: 'PieChart',
            data: {}
        };

        vm.saham.options = {
            title: 'Saham',
            allowHtml: true,
            allowCollapse: true,
            'width': 300,
            'height': 300,
            'chartArea':{
                left:0,
                top:10,
                width:'100%'
            }
        };

        vm.saham.data.cols = [
            {
                'label': 'Pemegang Saham',
                'pattern': '',
                'type': 'string'
            },
            {
                'label': 'Nilai',
                'pattern': '',
                'type': 'number'
            }
        ];

        PerusahaanFactory.getChartSaham(id).then(function (res) {
            vm.saham.data.rows = res.data.data;
        }, function (err) {
            if (err.message) {
                AppFactory.showToast(err.message, 'error', err.errors);
            }
        });
        //End Data chart saham

        //Data chart Performa
        vm.performa = {
            type: 'LineChart',
            data: {}
        };

        vm.performa.options = {
            title: 'Performa',
            allowHtml: true,
            allowCollapse: true,
            'width': 400,
            'height': 200,
            'chartArea':{
                left: 0,
                top: 10,
                width: '100%'
            }
        };   
        
        vm.performatbl = {
            type: 'Table',
            data: {}
        };

        vm.performatbl.options = {
            title: 'Performa',
            allowHtml: true,
            allowCollapse: true,
            'width': 650,
            'height': 200
        };
        

        PerusahaanFactory.getChartPerforma(id).then(function (res) {
            vm.performa.data.cols = res.data.data.cols;
            vm.performa.data.rows = res.data.data.rows;
            vm.performa = DashboardFactory.convertToChartData(vm.performa);
            vm.performatbl.data.cols = res.data.data.cols;
            vm.performatbl.data.rows = res.data.data.rows;
            vm.performatbl = DashboardFactory.convertToChartData(vm.performatbl);
        }, function (err) {
            if (err.message) {
                AppFactory.showToast(err.message, 'error', err.errors);
            }
        });
        //End Data chart Performa
    }
})();
