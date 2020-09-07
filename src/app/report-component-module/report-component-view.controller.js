(function() {
    'use strict';

    angular
        .module('report-component-module')
        .controller('ReportComponentViewController', ReportComponentViewController);

    /* @ngInject */
    function ReportComponentViewController($http, $state, EnvironmentConfig, $stateParams, ReportComponentFactory) {
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

        vm.cancelAction = ReportComponentFactory.cancelAction;
        /*** END - End Form ***/
    }
})();
