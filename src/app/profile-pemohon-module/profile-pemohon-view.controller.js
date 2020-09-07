(function() {
    'use strict';

    angular
        .module('profile-pemohon-module')
        .controller('ProfilePemohonView', ProfilePemohonView);

    /* @ngInject */
    function ProfilePemohonView(
        $state, $scope, $stateParams, $mdDialog, $mdMedia, $log, $document,
        ElementConfig, ProfilePemohonFactory, PerusahaanFactory, PermohonanIzinFactory, IzinFactory
    ) {
        var vm = this;
        vm.key_id = $stateParams.key_id;

        vm.pemohon = {};
        vm.cancelAction = ProfilePemohonFactory.cancelAction;
        vm.showFormAdd = showFormAdd;
        vm.showProcess = showProcess;
        vm.showPermohonanView = showPermohonanView;
        vm.showPerusahaanView = showPerusahaanView;
        vm.showIzinView = showIzinView;
        vm.showDokumenProfilePemohonView = showDokumenProfilePemohonView;
        vm.showDokumenProfilePemohonAdd = showDokumenProfilePemohonAdd;
        vm.showDokumen  = showDokumen;
        vm.showRating   = showRating;

        ProfilePemohonFactory.getProfilePemohon(vm.key_id).then(function (res) {
            angular.copy(res.data.data, vm.pemohon);
            activatePermohonan();
            activatePerusahaan();
            activateIzin();
            activateDokumenProfilePemohon();

            PermohonanIzinFactory.getGenderList().then(function (res) {
                vm.genderList = res.data.data.items;

                PermohonanIzinFactory.getJenisIdentitasList().then(function (res) {
                    vm.jenisIdentitasList = res.data.data.items
                });
            });
        });

        /////////////////
        function showFormAdd(keyId) {
            $state.go('triangular.admin-default.profile-pemohon-permohonan-izin-add', {'key_id': keyId});
        }

        function showDokumen(lokasi) {
            $log.info('Opening Dokumen Dialog');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: ProfilePemohonDialogController,
                templateUrl: 'app/profile-pemohon-module/profile-pemohon-dialog.tmpl.html',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: { dokumen: lokasi }
            })
                .then(function () {
                    // $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    // $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function showProcess(permohonanId) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: TrackingDialogController,
                templateUrl: 'app/profile-pemohon-module/tracking-dialog.tmpl.html',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    permohonanIzinId: permohonanId
                }
            })
            .then(function(dialogData) {
            }, function() {
                // $scope.status = 'You cancelled the dialog.';
            });

            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function showPermohonanView(permohonanId) {
            $state.go(
                'triangular.admin-default.profile-pemohon-permohonan-izin-detail',
                { 'key_id': vm.key_id, 'permohonan_id': permohonanId }
            );
        }

        function showPerusahaanView(perusahaanId) {
            $state.go(
                'triangular.admin-default.profile-pemohon-perusahaan-detail',
                { 'key_id': vm.key_id, 'perusahaan_id': perusahaanId }
            );
        }

        function showIzinView(izinId) {
            $state.go(
                'triangular.admin-default.profile-pemohon-izin-detail',
                { 'key_id': vm.key_id, 'izin_id': izinId }
            );
        }

        function showDokumenProfilePemohonView(dokumenProfilePemohonId) {
            $state.go(
                'triangular.admin-default.profile-pemohon-dokumen-detail',
                { 'key_id': vm.key_id, 'dokumen_pemohon_id': dokumenProfilePemohonId }
            );
        }

        function showDokumenProfilePemohonAdd() {
            $state.go(
                'triangular.admin-default.profile-pemohon-dokumen-add',
                { 'key_id': vm.key_id}
            );
        }

        function showRating(id) {
            $log.info('Opening Rating Dialog');
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: PemohonRatingDialogController,
                templateUrl: 'app/profile-pemohon-module/profile-pemohon-rating-dialog.tmpl.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                fullscreen: useFullScreen,
                locals: { permohonan_izin_id: id }
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
        
        /*** BEGIN - Permohonan Izin Table Grid ***/
        vm.queryPermohonan = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-permohonanizin.id',
            page: 1,
            pemohon_id: vm.key_id
        };
        vm.filterPermohonan = {
            options: {
                debounce: 500
            }
        };
        vm.getDataPermohonan = getDataPermohonan;

        ///////////
        function activatePermohonan() {
            var bookmark;
            $scope.$watch('vm.queryPermohonan.filter', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.queryPermohonan.page;
                }

                if (newValue !== oldValue) {
                    vm.queryPermohonan.page = 1;
                }

                if (!newValue) {
                    vm.queryPermohonan.page = bookmark;
                }

                vm.getDataPermohonan();
            });

            $scope.$watch('vm.queryPermohonan.begin_date', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.queryPermohonan.page;
                }

                if (newValue !== oldValue) {
                    vm.queryPermohonan.page = 1;
                }

                if (!newValue) {
                    vm.queryPermohonan.page = bookmark;
                }

                vm.getDataPermohonan();
            });

            $scope.$watch('vm.queryPermohonan.end_date', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.queryPermohonan.page;
                }

                if (newValue !== oldValue) {
                    vm.queryPermohonan.page = 1;
                }

                if (!newValue) {
                    vm.queryPermohonan.page = bookmark;
                }

                vm.getDataPermohonan();
            });
        }

        function getDataPermohonan() {
            PermohonanIzinFactory.getPagedPermohonanIzin(vm.queryPermohonan).then(function(res) {
                vm.dataPermohonan = res.data.data;
            });
        }
        /*** END - Permohonan Izin Table Grid ***/

        /*** BEGIN - Perusahaan Table Grid ***/
        vm.queryPerusahaan = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-perusahaan.id',
            page: 1,
            pemohon_id: vm.key_id
        };
        vm.filterPerusahaan = {
            options: {
                debounce: 500
            }
        };
        vm.getDataPerusahaan = getDataPerusahaan;

        ///////////
        function activatePerusahaan() {
            var bookmark;
            $scope.$watch('vm.queryPerusahaan.filter', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.queryPerusahaan.page;
                }

                if (newValue !== oldValue) {
                    vm.queryPerusahaan.page = 1;
                }

                if (!newValue) {
                    vm.queryPerusahaan.page = bookmark;
                }

                vm.getDataPerusahaan();
            });
        }

        function getDataPerusahaan() {
            PerusahaanFactory.getPagedPerusahaan(vm.queryPerusahaan).then(function(res) {
                vm.dataPerusahaan = res.data.data;
            });
        }
        /*** END - Perusahaan Table Grid ***/

        /*** BEGIN - Izin Table Grid ***/
        vm.queryIzin = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-izin.id',
            page: 1,
            pemohon_id: vm.key_id
        };
        vm.filterIzin = {
            options: {
                debounce: 500
            }
        };
        vm.getDataIzin = getDataIzin;

        ///////////
        function activateIzin() {
            var bookmark;
            $scope.$watch('vm.queryIzin.filter', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.queryIzin.page;
                }

                if (newValue !== oldValue) {
                    vm.queryIzin.page = 1;
                }

                if (!newValue) {
                    vm.queryIzin.page = bookmark;
                }

                vm.getDataIzin();
            });

            $scope.$watch('vm.queryIzin.begin_date', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.queryIzin.page;
                }

                if (newValue !== oldValue) {
                    vm.queryIzin.page = 1;
                }

                if (!newValue) {
                    vm.queryIzin.page = bookmark;
                }

                vm.getDataIzin();
            });

            $scope.$watch('vm.queryIzin.end_date', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.queryIzin.page;
                }

                if (newValue !== oldValue) {
                    vm.queryIzin.page = 1;
                }

                if (!newValue) {
                    vm.queryIzin.page = bookmark;
                }

                vm.getDataIzin();
            });
        }

        function getDataIzin() {
            IzinFactory.getPagedIzin(vm.queryIzin).then(function(res) {
                vm.dataIzin = res.data.data;
            });
        }
        /*** END - Perusahaan Table Grid ***/

        /*** BEGIN - Izin Table Grid ***/
        vm.queryDokumenProfilePemohon = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-id',
            page: 1,
            pemohon_id: vm.key_id
        };
        vm.filterDokumenProfilePemohon = {
            options: {
                debounce: 500
            }
        };
        vm.getDataDokumenProfilePemohon = getDataDokumenProfilePemohon;

        ///////////
        function activateDokumenProfilePemohon() {
            var bookmark;
            $scope.$watch('vm.queryDokumenProfilePemohon.filter', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.queryDokumenProfilePemohon.page;
                }

                if (newValue !== oldValue) {
                    vm.queryDokumenProfilePemohon.page = 1;
                }

                if (!newValue) {
                    vm.queryDokumenProfilePemohon.page = bookmark;
                }

                vm.getDataDokumenProfilePemohon();
            });
        }

        function getDataDokumenProfilePemohon() {
            ProfilePemohonFactory.getPagedDokumenProfilePemohon(vm.queryDokumenProfilePemohon).then(function(res) {
                vm.dataDokumenProfilePemohon = res.data.data;
            });
        }
        /*** END - Perusahaan Table Grid ***/
    }
})();

function ProfilePemohonDialogController($state, $scope, $mdDialog, $http, EnvironmentConfig, dokumen, ProfilePemohonFactory) {
    var type = dokumen.substr(-4);
    var filename = dokumen.split("dokumen_pemohon");

    $scope.tipe = type;
    $scope.url = EnvironmentConfig.api.replace('api/','') + 'files/dokumen_pemohon/'+filename[0];

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}

function TrackingDialogController($state, $scope, $mdDialog, $http, EnvironmentConfig, permohonanIzinId, MenuService, ProsesPengajuanFactory, FormFactory) {
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

    $scope.openForm = function(tautan, formId) {
        $mdDialog.hide();
        MenuService.openLink(tautan, formId, permohonanIzinId);
    };

    // Download report generated by jasper
    $scope.downloadReport = function(reportId) {
        FormFactory.downloadReport(reportId, permohonanIzinId);
    };
}

function PemohonRatingDialogController($state, $scope, $mdDialog, $http, EnvironmentConfig, permohonan_izin_id, AppFactory) {
    $scope.firstRate = 0;
    $scope.rate = 0;
    $scope.readOnly = true;

    $scope.onItemRating = function(rating){
        var conf = confirm('Apakah anda yankin ingin memberikan penilaian ini?');
        if (conf) {
            var reqData = {
                'rate' : rating
            };

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'PermohonanIzin/edit/' + permohonan_izin_id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $mdDialog.hide();
                    $state.reload();
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                    $mdDialog.hide();
                });
        } else {
            $mdDialog.hide();
        }
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}