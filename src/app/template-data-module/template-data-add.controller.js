(function () {
    'use strict';

    angular
        .module('template-data-module')
        .controller('TemplateDataAddController', TemplateDataAddController);

    /* @ngInject */
    function TemplateDataAddController(
        $http, $state, $mdDialog, $mdMedia, $log, $scope, $timeout, $mdToast,
        $window, $document, EnvironmentConfig, AppFactory, TemplateDataFactory,
        Upload, DYNAMIC, _
    ) {
        var vm = this;
        var userId, peranId, pegawaiId, unitId, instansiId;

        vm.api_url = EnvironmentConfig.api;
        vm.template_data = {
            keterangan: '',
            tipe_keluaran: null,
            output_as_pdf: false
        };
        vm.template_data.kelompok_data = [];
        vm.DYNAMIC = DYNAMIC;

        TemplateDataFactory.getTipeKeluaranList().then(function (res) {
            vm.tipeKeluaranList = res.data.data.items;

            TemplateDataFactory.getJenisSumberList().then(function (res) {
                vm.jenisSumberList = res.data.data.items;

                TemplateDataFactory.getTipeKelompokList().then(function (res) {
                    vm.tipeKelompokList = res.data.data.items;
                });
            });
        });
        getUserVars();

        vm.createAction = createAction;
        vm.cancelAction = TemplateDataFactory.cancelAction;

        ////////////////////////


        /** BEGIN - File Upload **/
        vm.status = 'idle';  // idle | uploading | complete
        vm.upload = upload;
        vm.downloadFile = downloadFile;

        var fileList;

        function upload($files) {
            if (!_.isNull($files) && $files.length > 0) {
                fileList = $files;

                uploadStarted();

                // $timeout(uploadComplete, 4000);

                Upload.upload({
                    url: EnvironmentConfig.api + 'TemplateData/upload',
                    data: {
                        file: fileList
                    }
                }).then(function (resp) {
                    $log.info('Success ' + resp.data.data.file_name + ' uploaded. Response: ' + resp.data.message);
                    vm.template_data.template_dokumen = resp.data.data.file_name;
                    uploadComplete();
                }, function (resp) {
                    $log.info('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }

        function uploadStarted() {
            vm.status = 'uploading';
        }

        function uploadComplete() {
            vm.status = 'complete';
            var message = 'Thanks for ';
            for (var file in fileList) {
                message += fileList[file].name + ' ';
            }
            $mdToast.show({
                template: '<md-toast><span flex>' + message + '</span></md-toast>',
                position: 'bottom right',
                hideDelay: 5000
            });

            $timeout(uploadReset, 3000);
        }

        function uploadReset() {
            vm.status = 'idle';
        }

        function downloadFile($filename) {
            $window.open(EnvironmentConfig.api + 'TemplateData/downloadFile/' + $filename, '_blank');
        }
        /** END - File Upload **/

        function createAction() {
            var reqData = vm.template_data;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'template_data',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.template-data');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Tab KelompokData ***/
        vm.addNewKelompokData = function () {
            vm.template_data.kelompok_data.push({
                    'label_kelompok': '',
                    'jenis_sumber': null,
                    'sql': null,
                    'combogrid_value_col': null,
                    'combogrid_label_col': null
            });
        };

        vm.removeKelompokData = function (index) {
            if (angular.isDefined(vm.template_data.kelompok_data[index].id)) {
                var kelompokDataId = vm.template_data.kelompok_data[index].id;
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
                    TemplateDataFactory.deleteKelompokData(kelompokDataId).then(function () {
                        vm.template_data.kelompok_data.splice(index, 1);
                    });
                });

            } else {
                vm.template_data.kelompok_data.splice(index, 1);
            }
        };

        vm.showQueryWindow = function (index) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: SqlDialogController,
                templateUrl: 'app/template-data-module/sql-dialog.tmpl.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    sqlQuery: vm.template_data.kelompok_data[index].sql
                }
            })
                .then(function (dialogData) {
                    vm.template_data.kelompok_data[index].sql = dialogData.sql;
                });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        vm.showWizard = function (index) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: WizardDialogController,
                templateUrl: 'app/template-data-module/wizard-dialog.tmpl.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    grupData: vm.template_data.kelompok_data[index]
                }
            })
                .then(function (dialogData) {
                    vm.template_data.kelompok_data[index] = dialogData;
                });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        vm.showTestQueryWindow = function (index) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            var locals = {
                sql: vm.template_data.kelompok_data[index].sql,
                user_id: userId,
                peran_id: peranId,
                pegawai_id: pegawaiId,
                unit_id: unitId,
                instansi_id: instansiId
            };

            $mdDialog.show({
                controller: TestQueryDialogController,
                templateUrl: 'app/template-data-module/test-query-dialog.tmpl.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: locals
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };
        /*** END - Tab KelompokData ***/

        function getUserVars() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'Pengguna/getuservars',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };

            $http(req)
                .success(function (res) {
                    userId = res.data.user_id;
                    peranId = res.data.peran_id;
                    pegawaiId = res.data.pegawai_id;
                    unitId = res.data.unit_id;
                    instansiId = res.data.instansi_id;
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
