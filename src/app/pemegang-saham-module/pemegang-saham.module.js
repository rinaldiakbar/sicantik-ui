(function() {
    'use strict';
    angular
    .module('pemegang-saham-module', [])
    .factory('PemegangSahamFactory', PemegangSahamFactory);
    function PemegangSahamFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getPemegangSaham: getPemegangSaham,
            querySearchSaham: querySearchSaham
        };

        function getPemegangSaham(id) {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpemegangsaham/' + id,
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

        function querySearchSaham(query) {
            return getSahamListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getSahamListService(query) {
            var params = {
                'q': query
            };

            var queryString = AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpemegangsaham/getPemegangList' + queryString,
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