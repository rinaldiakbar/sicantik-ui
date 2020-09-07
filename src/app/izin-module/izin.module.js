(function() {
    'use strict';

    angular
        .module('izin-module', [])
        .factory('IzinFactory', IzinFactory);

        /** Izin Factory **/
        function IzinFactory($http, $log, EnvironmentConfig, AppFactory) {
            return {
                getPagedIzin: getPagedIzin,
                getIzin: getIzin
            };

            function getPagedIzin(query) {
                var url = EnvironmentConfig.api + 'izin?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit + '&order=' + query.order;

                if (angular.isDefined(query.pemohon_id)) {
                    url += '&pemohon_id=' + query.pemohon_id; 
                }

                var req = {
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .error(function(err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }

            function getIzin(id) {
                var getDataReq = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'izin/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };

                return $http(getDataReq)
                    .error(function(err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }
        }
        /** .Izin Factory **/
})();
