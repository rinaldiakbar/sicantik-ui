(function() {
    'use strict';
    angular
        .module('jenis-absensi-module', [])
        .factory('JenisAbsensiFactory', JenisAbsensiFactory);

        function JenisAbsensiFactory($http, EnvironmentConfig, $state, AppFactory) {
            return {
                querySearchIzin: querySearchIzin                
            };

            function querySearchIzin(query) {
                return getIzinListService(query).then(function(res) {
                    return res.data.data.items;
                });
            }

            function getIzinListService(query) {
                var params = {
                    'q': query
                };

                var queryString = AppFactory.httpBuildQuery(params);

                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'cjenisabsensi/getJenisAbsensiList' + queryString,
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
