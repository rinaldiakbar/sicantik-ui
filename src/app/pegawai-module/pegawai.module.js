(function() {
    'use strict';

    angular
        .module('pegawai-module', [])
        .factory('PegawaiFactory', PegawaiFactory);

    function PegawaiFactory($http, $log, $state, AppFactory, EnvironmentConfig) {
        return {
            getPagedPegawai: getPagedPegawai,
            getPegawai: getPegawai,
            deletePegawai: deletePegawai,
            cancelAction: cancelAction
        };

        function getPagedPegawai(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pegawai?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function getPegawai(id) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pegawai/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(getDataReq)
                .error(function(err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.pegawai');
                });
        }

        function deletePegawai(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'pegawai/' + id,
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
            $state.go('triangular.admin-default.pegawai');
        }
    }
})();
