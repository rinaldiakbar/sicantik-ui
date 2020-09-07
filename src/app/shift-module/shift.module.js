(function() {
    'use strict';
    angular
        .module('shift-module', [])
        .factory('ShiftFactory', ShiftFactory);

        function ShiftFactory($http, EnvironmentConfig, $state, AppFactory) {
            return {
                querySearchShift: querySearchShift                
            };

            function querySearchShift(query) {
                return getShiftListService(query).then(function(res) {
                    return res.data.data.items;
                });
            }

            function getShiftListService(query) {
                var params = {
                    'q': query
                };

                var queryString = AppFactory.httpBuildQuery(params);

                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'cshift/getShiftList' + queryString,
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
