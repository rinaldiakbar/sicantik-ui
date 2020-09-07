(function() {
    'use strict';
    angular
        .module('service-eksternal-module', [])
        .factory('ServiceEksternalFactory', ServiceEksternalFactory);

    function ServiceEksternalFactory($http, EnvironmentConfig, $log, $state, AppFactory) {
        return {
            getPagedServiceEksternal: getPagedServiceEksternal,
            getServiceEksternal: getServiceEksternal,
            deleteServiceEksternal: deleteServiceEksternal,
            getTipeOtentikasiList: getTipeOtentikasiList,
            querySearchServiceEksternal: querySearchServiceEksternal,
            cancelAction: cancelAction
        };

        function getPagedServiceEksternal(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'service_eksternal?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function() {})
                .error(function(err) {
                    $log.error(err);
                });
        }

        function getServiceEksternal(id) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'service_eksternal/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function() {
                    $state.go('triangular.admin-default.service-eksternal');
                });
        }

        function deleteServiceEksternal(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'service_eksternal/' + id,
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

        function getTipeOtentikasiList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'service_eksternal/tipeotentikasilist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function() {})
                .error(function(err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchServiceEksternal(query) {
            return getServiceEksternalListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getServiceEksternalListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'service_eksternal/list?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function() {})
                .error(function(err) {
                    $log.error(err);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.service-eksternal');
        }
    }
})();
