(function() {
    'use strict';

    angular
        .module('desa-module', [
        ])

        .factory('DesaFactory', DesaFactory);

    function DesaFactory($http, $state, $log, EnvironmentConfig, AppFactory) {
        return {
            getPagedDesa: getPagedDesa,
            getDesa: getDesa,
            deleteDesa: deleteDesa,
            cancelAction: cancelAction,
            querySearchKecamatan: querySearchKecamatan,
            getKecamatanListService: getKecamatanListService
        };

        function getPagedDesa(query) {
            var kecamatanId = (angular.isDefined(query.kecamatan_id)) ? query.kecamatan_id : '';

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'desa?q='+query.filter+'&page='+query.page+'&limit='+query.limit+'&kecamatan_id='+kecamatanId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }

        function getDesa(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'desa/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err){
                    $log.error(err);
                    $state.go('triangular.admin-default.desa');
                });
        }

        function deleteDesa(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'desa/' + id,
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
            $state.go('triangular.admin-default.desa');
        }

        function querySearchKecamatan (query) {
            return getKecamatanListService(query).then(function(res){
                return res.data.data.items;
            });
        }

        function getKecamatanListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'kecamatan/list?q='+query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }
    }
})();
