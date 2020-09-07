(function() {
    'use strict';

    angular
        .module('notifikasi-module')
        .controller('NotifikasiEditController', NotifikasiEditController);

    /* @ngInject */
    function NotifikasiEditController(
        $http, $state, $log, $mdDialog, $mdMedia, $stateParams, $scope, $document,
        EnvironmentConfig, AppFactory, JenisIzinFactory, NotifikasiFactory
    ) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.jenis_izin = {};
        vm.tipeList = [];
        vm.tipePenerimaList = [];
        vm.jabatanList = [];

        NotifikasiFactory.getNotifikasi(id).then(function(res) {
            angular.copy(res.data.data, vm.jenis_izin);

            NotifikasiFactory.getSupportData().then(function(res) {
                vm.tipeList = res.data.data.tipelist;
                vm.tipePenerimaList = res.data.data.tipepenerimalist;
                vm.jabatanList = res.data.data.jabatanlist;
            });
        });

        vm.updateAction = updateAction;
        vm.cancelAction = NotifikasiFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'jenis_izin': vm.jenis_izin
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'notifikasi/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.notifikasi');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - End Form ***/

        /** Detail Form **/
        vm.addDetail = addDetail;
        vm.editMessage = editMessage;
        vm.removeDetail = removeDetail;

        ////////
        function addDetail(pengajuanIndex, prosesIndex, daftarProsesId) {
            var newData = {
                daftar_proses_id: daftarProsesId,
                tipe: null,
                format_pesan: null,
                tipe_penerima: null,
                jabatan_id: null
            };
            vm.jenis_izin.jenis_pengajuan[pengajuanIndex].alur_prose.daftar_proses[prosesIndex].details.push(newData);
        }

        function editMessage(pengajuanIndex, prosesIndex, daftarProsesId, index) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            var details = vm.jenis_izin.jenis_pengajuan[pengajuanIndex].alur_prose.daftar_proses[prosesIndex].details;
            var detail = details[index];

            $mdDialog.show({
                    controller: PesanDialogController,
                    templateUrl: 'app/notifikasi-module/pesan-dialog.tmpl.html',
                parent: angular.element($document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        formatPesan: detail.format_pesan,
                        disabled: false
                    }
                })
                .then(function(dialogData) {
                    detail.format_pesan = dialogData.format_pesan;
                });

            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function removeDetail(pengajuanIndex, prosesIndex, daftarProsesId, index) {
            var details = vm.jenis_izin.jenis_pengajuan[pengajuanIndex].alur_prose.daftar_proses[prosesIndex].details;
            var detail = vm.jenis_izin.jenis_pengajuan[pengajuanIndex].alur_prose.daftar_proses[prosesIndex].details[index];

            if (angular.isDefined(detail.id)) {
                var detailId = detail.id;
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
                    NotifikasiFactory.deleteNotifikasiDetail(detailId).then(function() {
                        details.splice(index, 1);
                    });
                });
            } else {
                details.splice(index, 1);
            }
        }
        /** .Detail Form **/
    }
})();