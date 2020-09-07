(function() {
    'use strict';
    angular
        .module('penomoran-module', [
        ])
        .factory('PenomoranFactory', PenomoranFactory);

    function PenomoranFactory($http, EnvironmentConfig, $state, $log, AppFactory) {
        return {
            getPagedPenomoran: getPagedPenomoran,
            getPenomoran: getPenomoran,
            deletePenomoran: deletePenomoran,
            deleteDetail: deleteDetail,
            cancelAction: cancelAction,
            querySearchInstansi: querySearchInstansi,
            querySearchUnit: querySearchUnit,
            querySearchPenomoran: querySearchPenomoran,
            getPenomoranListService: getPenomoranListService
        };

        function getPagedPenomoran(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'penomoran?q='+query.filter+'&page='+query.page+'&limit='+query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }

        function getPenomoran(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'penomoran/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err){
                    $log.error(err);
                    $state.go('triangular.admin-default.penomoran');
                });
        }

        function deletePenomoran(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'penomoran/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function deleteDetail(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'Penomoran/deletedetail/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.penomoran');
        }

        function querySearchInstansi(query) {
            return getInstansiList(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getInstansiList(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/instansilist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
              .error(function (err) {
                  $log.error(err);
              });
        }

        function querySearchUnit(query) {
            return getUnitList(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function querySearchPenomoran (query) {
            return getPenomoranListService(query).then(function(res){
                return res.data.data.items;
            });
        }

        function getPenomoranListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'penomoran/list?q='+query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }

        function getUnitList(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/unitlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
              .error(function (err) {
                  $log.error(err);
              });
        }
    }
})();
