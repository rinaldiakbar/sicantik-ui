(function() {
    'use strict';

    angular
        .module('posisi-module', [])

    .factory('PosisiFactory', PosisiFactory);

    function PosisiFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getPosisi: getPosisi,
            querySearchPosisi: querySearchPosisi
        };

        function getPosisi(id) {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cposisi/' + id,
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

        function querySearchPosisi(query) {
            return getPosisiListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getPosisiListService(query) {
            var params = {
                'q': query
            };

            var queryString = AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cposisi/getPosisiList' + queryString,
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