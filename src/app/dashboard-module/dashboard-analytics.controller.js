(function () {
    'use strict';

    angular
        .module('dashboard-module')
        .controller('DashboardAnalyticsController', DashboardAnalyticsController);

    /* @ngInject */
    function DashboardAnalyticsController(
        $stateParams, $log, $scope, DashboardFactory,DashboardSettingFactory
    ) {
        var vm = this;
        var id = $stateParams.page_id;

        vm.tabs = [];
        vm.charts = {}; // content ID as key

        DashboardSettingFactory.getDashboardSetting(id).then(function (res) {
            vm.page = {};
            angular.copy(res.data.data, vm.page);
            vm.searchTextInstansi = res.data.data.instansi ?
                res.data.data.instansi.nama : null;

            if (vm.page.page_content) {
                buildCharts(vm.page.page_content);
            }

            vm.tabs = vm.page.page_tab;
            delete vm.page; // remove unused element
        });

        function buildCharts(contents) {
            angular.forEach(contents, function (val) {
                if (val.del == 0) {
                    // Get Chart cols and rows
                    DashboardFactory.getChartData(val.id)
                    // DashboardFactory.getData(val.webservice, val.type_chart)
                        .then(function (chartData) {
                            vm.charts[val.id] = DashboardFactory.setupChart(
                                val.type_chart, val.tab_idx, val.title, '',
                                val.height, val.width, chartData.data.data.cols,
                                chartData.data.data.rows);
                        });
                }
            });
        }
    }
})();
