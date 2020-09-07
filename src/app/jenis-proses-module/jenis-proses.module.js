(function() {
    'use strict';
    angular
        .module('jenis-proses-module', [
        ])
        .factory('JenisProsesFactory', JenisProsesFactory);

    function JenisProsesFactory($http, $log, $state, AppFactory, EnvironmentConfig) {
            return {
                getPagedJenisProses: getPagedJenisProses,
                getJenisProses: getJenisProses,
                deleteJenisProses: deleteJenisProses,
                cancelAction: cancelAction,
                querySearchJenisProses: querySearchJenisProses,
                getJenisProsesListService: getJenisProsesListService
            };

            function getPagedJenisProses(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'jenis_proses?q='+query.filter+'&page='+query.page+'&limit='+query.limit,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .error(function(err){
                    $log.error(err);
                    });
            }

            function getJenisProses(id) {
                var getDataReq = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'jenis_proses/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(getDataReq)
                    .error(function(err){
                    $log.error(err);
                        $state.go('triangular.admin-default.jenis-proses');
                    });
            }

            function querySearchJenisProses (query) {
                    return getJenisProsesListService(query).then(function(res){
                        return res.data.data.items;
                    });
            }

            function getJenisProsesListService(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'jenis_proses/list?q='+query,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .error(function(err){
                    $log.error(err);
                    });
            }

            function deleteJenisProses(id) {
                var req = {
                    method: 'DELETE',
                    url: EnvironmentConfig.api + 'jenis_proses/' + id,
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
                $state.go('triangular.admin-default.jenis-proses');
            }
        }
})();
