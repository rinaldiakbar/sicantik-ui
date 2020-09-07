(function () {
    'use strict';
    angular
        .module('jenis-usaha-module', [])
        .factory('JenisUsahaFactory', JenisUsahaFactory);

    function JenisUsahaFactory($http, $log, EnvironmentConfig, $state, AppFactory) {
        return {
            getPagedJenisUsaha: getPagedJenisUsaha,
            getJenisUsaha: getJenisUsaha,
            deleteJenisUsaha: deleteJenisUsaha,
            cancelAction: cancelAction,
            querySearchBidangUsaha: querySearchBidangUsaha
        };

        function getPagedJenisUsaha(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_usaha?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getJenisUsaha(id) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_usaha/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function (err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.jenis-usaha');
                });
        }

        function deleteJenisUsaha(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'jenis_usaha/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.jenis-usaha');
        }

        function querySearchBidangUsaha(query) {
            return getBidangUsahaListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getBidangUsahaListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'bidang_usaha/list?q=' + query,
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
