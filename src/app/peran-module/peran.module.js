(function() {
    'use strict';

    angular
        .module('peran-module', [])
        .factory('PeranFactory', PeranFactory);

    function PeranFactory($http, $log, $state, AppFactory, EnvironmentConfig) {

        return {
            getPagedPeran: getPagedPeran,
            getPeran: getPeran,
            deletePeran: deletePeran,
            cancelAction: cancelAction,
            querySearchInstansi: querySearchInstansi,
            getInstansiListService: getInstansiListService,
            getAllMenu: getAllMenu
        };

        function getPagedPeran(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'peran?q='+query.filter+'&page='+query.page+'&limit='+query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function getPeran(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'peran/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.peran');
                });
        }

        function deletePeran(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'peran/' + id,
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

        function cancelAction() {
            $state.go('triangular.admin-default.peran');
        }

        function querySearchInstansi (query) {
            return getInstansiListService(query).then(function(res){
                return res.data.data.items;
            });
        }

        function getInstansiListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/instansilist?q='+query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function getAllMenu() {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'peran/allmenu',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.peran');
                });
        }
    }
})();
