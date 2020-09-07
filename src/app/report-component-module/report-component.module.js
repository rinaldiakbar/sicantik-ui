(function() {
    'use strict';
    angular
        .module('report-component-module', [])
        .factory('ReportComponentFactory', ReportComponentFactory);

    function ReportComponentFactory($http, EnvironmentConfig, $log, $state, AppFactory) {
        return {
            getReportComponent: getReportComponent,
            getSupportData: getSupportData,
            deleteReportComponentDetail: deleteReportComponentDetail,
            cancelAction: cancelAction
        };

        function getReportComponent(id) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'report_components/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.report-component');
                });
        }

        function getSupportData() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'report_components/supportdata',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
              .error(function(err) {
                  $log.error(err);
              });
        }

        function deleteReportComponentDetail(reportComponentDetailId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'report_components/deleteReportComponentDetail/' + reportComponentDetailId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.report-component');
        }
    }
})();
