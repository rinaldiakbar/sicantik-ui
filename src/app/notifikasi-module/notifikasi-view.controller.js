(function() {
    'use strict';

    angular
        .module('notifikasi-module')
        .controller('NotifikasiViewController', NotifikasiViewController);

    /* @ngInject */
    function NotifikasiViewController(
        $http, $state, $scope, $mdMedia, $mdDialog, $log, $document,
        EnvironmentConfig, $stateParams, NotifikasiFactory
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

        vm.cancelAction = NotifikasiFactory.cancelAction;
        /*** END - End Form ***/


        /*** BEGIN - Detail Form ***/
        vm.editMessage = editMessage;

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
                    disabled: true
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
        /*** END - Detail Form ***/
    }
})();
