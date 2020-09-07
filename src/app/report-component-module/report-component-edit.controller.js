(function() {
    'use strict';

    angular
        .module('report-component-module')
        .controller('ReportComponentEditController', ReportComponentEditController);

    /* @ngInject */
    function ReportComponentEditController($http, $state, $log, $mdDialog, $mdMedia, $stateParams, $scope, EnvironmentConfig, AppFactory, JenisIzinFactory, ReportComponentFactory) {
        var vm = this;
        var id = $stateParams.id;

        /*** BEGIN - Main Form ***/
        vm.jenis_izin = {};
        vm.pegawaiList = [];

        ReportComponentFactory.getReportComponent(id).then(function(res) {
            angular.copy(res.data.data, vm.jenis_izin);

            ReportComponentFactory.getSupportData().then(function(res) {
                vm.pegawaiList = res.data.data.pegawailist;
            });
        });

        vm.updateAction = updateAction;
        vm.cancelAction = ReportComponentFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'jenis_izin': vm.jenis_izin
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'report_components/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.report-component');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - End Form ***/


        /** Detail Form **/
        vm.addDetail = addDetail;
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
                    ReportComponentFactory.deleteReportComponentDetail(detailId).then(function() {
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
