(function() {
    'use strict';

    angular
        .module('lokasi-kerja-module', [])

    .factory('LokasiKerjaFactory', LokasiKerjaFactory);

    function LokasiKerjaFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getLokasi: getLokasi,
            querySearchLokasi: querySearchLokasi
        };

        function getLokasi(id) {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'clokasikerja/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .success(function() {})
                .error(function(err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchLokasi(query) {
            return getLokasiListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getLokasiListService(query) {
            var params = {
                'q': query
            };

            var queryString = AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'clokasikerja/getLokasiList' + queryString,
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