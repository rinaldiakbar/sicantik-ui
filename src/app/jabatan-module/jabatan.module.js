(function() {
    'use strict';

    angular
        .module('jabatan-module', [])

    .factory('JabatanFactory', JabatanFactory);

    function JabatanFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getJabatan: getJabatan,
            querySearchJabatan: querySearchJabatan,
            querySearchCJabatan : querySearchCJabatan
        };

        function getJabatan(id) {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jabatan/' + id,
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
                    $state.go('triangular.admin-default.unit');
                });
        }

        function querySearchJabatan(query) {
            return getJabatanListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getJabatanListService(query) {
            var params = {
                'q': query
            };

            var queryString = AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jabatan/list' + queryString,
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

        function querySearchCJabatan(query) {
            return getCJabatanListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getCJabatanListService(query) {
            var params = {
                'q': query
            };

            var queryString = AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cjabatan/getJabatanList' + queryString,
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