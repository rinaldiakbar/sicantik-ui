(function() {
    'use strict';
    angular
        .module('payroll-group-module', [])
        .factory('PayrollGroupFactory', PayrollGroupFactory);

        function PayrollGroupFactory($http, EnvironmentConfig, $state, AppFactory) {
            return {
                querySearchGroup: querySearchGroup                
            };

            function querySearchGroup(query) {
                return getGroupListService(query).then(function(res) {
                    return res.data.data.items;
                });
            }

            function getGroupListService(query) {
                var params = {
                    'q': query
                };

                var queryString = AppFactory.httpBuildQuery(params);

                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'cpayrollgroup/getPayrollGroupList' + queryString,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };

                return $http(req)
                    .success(function() {
                    })
                    .error(function(err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }
        }
})();
