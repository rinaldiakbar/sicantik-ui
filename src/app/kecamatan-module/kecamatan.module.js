(function() {
    'use strict';
    angular
        .module('kecamatan-module', [
        ])
        .factory('KecamatanFactory', KecamatanFactory);

    function KecamatanFactory($http, $state, $log, EnvironmentConfig, AppFactory) {
            return {
                getPagedKecamatan: getPagedKecamatan,
                getKecamatan: getKecamatan,
                deleteKecamatan: deleteKecamatan,
                cancelAction: cancelAction,
                querySearchKabupaten: querySearchKabupaten,
                getKabupatenListService: getKabupatenListService
            };

            function getPagedKecamatan(query) {
            var kabupatenId = (angular.isDefined(query.kabupaten_id)) ? query.kabupaten_id : '';
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'kecamatan?q='+query.filter+'&page='+query.page+'&limit='+query.limit+'&kabupaten_id='+kabupatenId,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .error(function(err){
                    $log.error(err);
                    });
            }

            function getKecamatan(id) {
                // GET the original Data
                var getDataReq = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'kecamatan/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(getDataReq)
                    .error(function(err){
                    $log.error(err);
                        $state.go('triangular.admin-default.kabupaten');
                    });
            }

            function deleteKecamatan(id) {
                var req = {
                    method: 'DELETE',
                    url: EnvironmentConfig.api + 'kecamatan/' + id,
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
                $state.go('triangular.admin-default.kecamatan');
            }

            function querySearchKabupaten (query) {
                    return getKabupatenListService(query).then(function(res){
                        return res.data.data.items;
                    });
            }

            function getKabupatenListService(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'kabupaten/list?q='+query,
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
