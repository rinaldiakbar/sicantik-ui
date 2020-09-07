(function () {
    'use strict';

    angular
        .module('dashboard-setting-module', [])
        .factory('DashboardSettingFactory', DashboardSettingFactory);

    function DashboardSettingFactory($http, EnvironmentConfig, $state, AppFactory, _) {
        return {
            getPagedDashboardSetting: getPagedDashboardSetting,
            getDashboardSetting: getDashboardSetting,
            deleteDashboardSetting: deleteDashboardSetting,
            cancelAction: cancelAction,
            getChartTypeList: getChartTypeList
        };

        function getPagedDashboardSetting(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pages?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function getDashboardSetting(id) {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pages/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function (err) {
                    if (!_.isNull(err)) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function deleteDashboardSetting(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'pages/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.dashboard-setting');
        }

        function getChartTypeList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pages/chart_types',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }
    }
})();

function ContentDialogController($scope, $mdDialog, chartSetting, predefinedTabIdx, chartTypes, _) {
    $scope.formData = {};
    if (angular.isDefined(chartSetting) && !_.isNull(chartSetting)) {
        $scope.formData = chartSetting;
    }
    if (angular.isDefined(predefinedTabIdx) && !_.isNull(predefinedTabIdx)) {
        $scope.formData['tab_idx'] = predefinedTabIdx;
    }

    $scope.chartTypeList = chartTypes;
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        if (!$scope.formData['del']) {
            $scope.formData['del'] = 0;
        }
        $mdDialog.hide($scope.formData);
    };
}

function TabDialogController($scope, $mdDialog, data) {
    $scope.formData = {};
    if (angular.isDefined(data)) {
        $scope.formData = data;
    }

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        if (!$scope.formData['del']) {
            $scope.formData['del'] = 0;
        }
        $mdDialog.hide($scope.formData);
    };
}