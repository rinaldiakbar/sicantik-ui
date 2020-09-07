(function () {
    'use strict';
    angular
        .module('dashboard-module', [])
        .factory('DashboardFactory', DashboardFactory);

    function DashboardFactory($http, EnvironmentConfig, $state, $log, AppFactory) {
        return {
            getPage: getPage,
            getData: getData,
            getChartData: getChartData,
            setupChart: setupChart,
            convertToChartData: convertToChartData
        };

        function getPage(id) {
            var dataUrl = EnvironmentConfig.api + 'dashboard/contents/' + id;

            // GET the Data
            var getDataReq = {
                method: 'GET',
                url: dataUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function (err) {
                    if (err && err.hasOwnProperty('message')) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                    $state.go('triangular.admin-default.home');
                });
        }

        // Get Chart Data from Web Service
        function getData(dataUrl, chartType) {
            dataUrl += '?chart_type=' + chartType;
            if (dataUrl.substr(0, 4) !== 'http') {
                dataUrl = EnvironmentConfig.api + dataUrl;
            }

            // GET the Data
            var getDataReq = {
                method: 'GET',
                url: dataUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .success(function () {})
                .error(function (err) {
                    if (err && err.hasOwnProperty('message')) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                    $state.go('triangular.admin-default.home');
                });
        }

        function getChartData(chartId) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pages/charts/' + chartId,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(getDataReq)
                .success(function () {})
                .error(function (err) {
                    if (err && err.hasOwnProperty('message')) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                    $state.go('triangular.admin-default.home');
                });
        }

        function setupChart(
            chartType, tabIndex, title, subtitle, height, width, cols, rows
        ) {
            var chart = {};
            chart.data = {};
            chart.type = chartType;

            if (chartType !== 'PieChart') {
                chart.options = {
                    chart: {
                        'title': title,
                        'subtitle': subtitle
                    },
                    //'isStacked': "true",
                    width: width,
                    height: height,
                    'chartArea':{
                        left: 0,
                        top: 10,
                        width: '100%'
                    }
                };
            } else {
                chart.options = {
                    title: title,
                    width: width,
                    height: height,
                    'chartArea': {
                        left: 0,
                        top: 10,
                        width: '100%'
                    }
                };
            }

            chart.tab_idx = tabIndex;
            chart.data.cols = cols;
            chart.data.rows = rows;
            return convertToChartData(chart);
        }

        function convertToChartData(chart) {
            var newData = {};
            newData.cols = [];

            for (var i = 0; i < chart.data.cols.length;) {
                newData.cols[i] = {};
                newData.cols[i].id = chart.data.cols[i].lbl_id;
                newData.cols[i].type = chart.data.cols[i].type;
                newData.cols[i].label = chart.data.cols[i].label;
                i = i + 1;
            }

            newData.rows = [];
            for (var j = 0; j < chart.data.rows.length;) {
                newData.rows.push({});
                newData.rows[j].c = [];

                for (var Tdata in chart.data.rows[j]) {
                    if (isNaN(chart.data.rows[j][Tdata]) === false) {
                        newData.rows[j].c.push({
                            v: parseInt(chart.data.rows[j][Tdata])
                        });
                    } else {
                        newData.rows[j].c.push({
                            v: chart.data.rows[j][Tdata]
                        });
                    }
                }
                j = j + 1;
            }

            chart.data = newData;
            return chart;
        }
    }
})();
