(function() {
    'use strict';

    angular
        .module('kalender-module')
        .controller('KalenderEditController', KalenderEditController);

    /* @ngInject */
    function KalenderEditController($http, $state, $mdToast, EnvironmentConfig,
        APP_CONFIG, $stateParams, $mdDialog, AppFactory, KalenderFactory,
        UnitFactory
    ) {
        var vm = this;
        var instansiId = $stateParams.instansi_id;

        /*** BEGIN - Main Form ***/
        vm.kalender_hari = [];
        vm.kalender_tanggal = [];
        vm.instansi = [];

        // Get Instansi Data
        UnitFactory.getUnit(instansiId).then(function (res) {
            angular.copy(res.data.data, vm.instansi);

            // Get List Hari
            KalenderFactory.getHariListService().then(function (res) {
                vm.optionHari = res.data.data.items;

                // Get Kalender
                KalenderFactory.getKalender(instansiId).then(function (res) {
                    vm.kalender_hari = res.data.data.kalender_hari;
                    vm.kalender_tanggal = res.data.data.kalender_tanggal;

                    for (var i = 0; i < vm.kalender_tanggal.length; i++) {
                        vm.kalender_tanggal[i].tanggal = moment(vm.kalender_tanggal[i].tanggal, APP_CONFIG.datepickerFormat).toDate();
                    }
                });
            });
        });

        vm.saveAction = saveAction;
        vm.cancelAction = function() {
            KalenderFactory.cancelAction();
        };

        function saveAction() {
            var reqData = {
                'instansi_id': instansiId,
                'kalender_hari' : vm.kalender_hari,
                'kalender_tanggal': vm.kalender_tanggal
            };

            vm.kalender_hari.forEach(function(val, key) {
                vm.kalender_hari[key].tanggal = moment(val.tanggal).format(APP_CONFIG.datepickerFormat);
            });

            vm.kalender_tanggal.forEach(function(val, key) {
                vm.kalender_tanggal[key].tanggal = moment(val.tanggal).format(APP_CONFIG.datepickerFormat);
            });

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'kalender/save',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.kalender');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** END - End Form ***/

        /*** BEGIN - Tab Kalender Hari ***/
        vm.addKalenderHari = function() {
            vm.kalender_hari.push(
                {
                    'idx_hari': null
                }
            );
        };

        vm.removeKalenderHari = function(index) {
            if (angular.isDefined(vm.kalender_hari[index].id)) {
                var kalenderId = vm.kalender_hari[index].id;
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
                    KalenderFactory.deleteKalender(kalenderId).then(function () {
                        vm.kalender_hari.splice(index, 1);
                    });
                });

            } else {
                vm.kalender_hari.splice(index, 1);
            }
        };
        /*** END - Tab Kalender Hari ***/

        /*** BEGIN - Tab Kalender Tanggal ***/
        vm.addKalenderTanggal = function() {
            vm.kalender_tanggal.push(
                {
                    'tanggal': null
                }
            );
        };

        vm.removeKalenderTanggal = function(index) {
            if (angular.isDefined(vm.kalender_tanggal[index].id)) {
                var kalenderId = vm.kalender_tanggal[index].id;
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
                    KalenderFactory.deleteKalender(kalenderId).then(function () {
                        vm.kalender_tanggal.splice(index, 1);
                    });
                });

            } else {
                vm.kalender_tanggal.splice(index, 1);
            }
        };
        /*** END - Tab Kalender Tanggal ***/
    }
})();
