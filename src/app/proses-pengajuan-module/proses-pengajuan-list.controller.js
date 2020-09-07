(function() {
    'use strict';

    angular
        .module('proses-pengajuan-module')
        .controller('ProsesPengajuanList', ProsesPengajuanList);

    /* @ngInject */
    function ProsesPengajuanList(
        $http, $state, $document, EnvironmentConfig, ElementConfig, $scope, $timeout, $q, $mdDialog, $mdMedia,
        ProsesPengajuanFactory
    ) {
        var vm = this;

        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.proses-pengajuan-view', { 'permohonan_id': id });
        };

        vm.confirmDelete = function(id) {
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
            ).then(function() {
                ProsesPengajuanFactory.deleteProsesPengajuan(id).then(function() {
                    getData();
                });
            });
        };

        vm.showProcess = showProcess;

        ///////////
        function showProcess(permohonanIzinId) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: ProgressDialogController,
                templateUrl: 'app/proses-pengajuan-module/progress-dialog.tmpl.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    permohonanIzinId: permohonanIzinId
                }
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        vm.showDocument = showDocument;

        function showDocument(permohonanIzinId) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: DocumentDialogController,
                templateUrl: 'app/proses-pengajuan-module/document-dialog.tmpl.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    permohonanIzinId: permohonanIzinId
                }
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /*** BEGIN - Advance Table ***/
        vm.query = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-permohonanizin.id',
            page: 1
        };
        vm.filter = {
            options: {
                debounce: 500
            }
        };
        vm.getData = getData;
        vm.removeFilter = removeFilter;
        activate();

        ///////////
        function activate() {
            var bookmark;
            $scope.$watch('vm.query.filter', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.query.page;
                }

                if (!newValue) {
                    vm.query.page = bookmark;
                }

                if (newValue !== oldValue) {
                    vm.getData();
                }
            });
        }

        function getData() {
            ProsesPengajuanFactory.getPagedProsesPengajuan(vm.query).then(function(res) {
                vm.data = res.data.data;
            });
        }

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }
        /*** END - Advance Table ***/
    }
})();

function ProgressDialogController(
    $state, $scope, $mdDialog, $http, EnvironmentConfig, permohonanIzinId,
    MenuService, ProsesPengajuanFactory, FormFactory, PermohonanIzinFactory
) {
    $scope.prosesPermohonan = [];

    ProsesPengajuanFactory.getProsesPermohonan(permohonanIzinId).then(function(res) {
        $scope.prosesPermohonan = res.data.data;
    }, function() {
        $mdDialog.cancel();
    });

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.openForm = function(tautan, formId, prosesPermohonanId) {
        $mdDialog.hide();
        MenuService.openLink(tautan, formId, permohonanIzinId, null, prosesPermohonanId);
    };

    // Download report generated by jasper
    $scope.downloadReport = function(reportId, prosesPermohonanId) {
        FormFactory.downloadReport(reportId, permohonanIzinId);
        PermohonanIzinFactory.getNextStep(permohonanIzinId, prosesPermohonanId, false);
    };
}

function DocumentDialogController(
    $scope, $mdDialog, EnvironmentConfig, permohonanIzinId, AppFactory, ProsesPengajuanFactory
) {
    'use strict';

    var fileList;
    $scope.prosesPermohonan = [];

    ProsesPengajuanFactory.getProsesPermohonan(permohonanIzinId)
        .then(function(res) {
            $scope.prosesPermohonan = res.data.data;
        }, function() {
            $mdDialog.cancel();
        });

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.uploadFile = function($files, $flag) {
        if (!_.isNull($files) && $files.length > 0) {
            fileList = $files;

            $scope.uploadStarted();

            Upload.upload({
                url: EnvironmentConfig.api + 'caduan/uploadFile',
                data: {
                    file: fileList
                }
            }).then(function (resp) {
                vm.data.file_url = resp.data.data.file_url;
                $scope.uploadComplete();

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

    $scope.uploadStarted = function() {
        vm.upload_status = 'uploading';
    }

    $scope.uploadComplete = function() {
        vm.upload_status = 'complete';
        var message = 'Berhasil upload ';

        for (var file in fileList) {
            message += fileList[file].name + ' ';
        }

        AppFactory.showToast(message);
        $timeout(uploadReset(), 3000);

        fileList = null;
    }
}