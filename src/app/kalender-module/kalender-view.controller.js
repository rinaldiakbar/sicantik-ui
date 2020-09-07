(function() {
    'use strict';

    angular
        .module('kalender-module')
        .controller('KalenderViewController', KalenderViewController);

    /* @ngInject */
    function KalenderViewController($stateParams, KalenderFactory, UnitFactory) {
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
                        vm.kalender_tanggal[i].tanggal = new Date(vm.kalender_tanggal[i].tanggal);
                    }
                });
            });
        });

        vm.cancelAction = function() {
            KalenderFactory.cancelAction();
        };
        /*** END - End Form ***/
    }
})();
