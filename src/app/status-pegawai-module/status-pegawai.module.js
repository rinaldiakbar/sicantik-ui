(function() {
    'use strict';

    angular
        .module('status-pegawai-module', [])

    .factory('StatusPegawaiFactory', StatusPegawaiFactory);

    function StatusPegawaiFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getStatus: getStatus,
            querySearchStatusPegawai: querySearchStatusPegawai
        };

        function getStatus(id) {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cstatuskepegawaian/' + id,
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

        function querySearchStatusPegawai(query) {
            return getStatusListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getStatusListService(query) {
            var params = {
                'q': query
            };

            var queryString = AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cstatuskepegawaian/getStatusList' + queryString,
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