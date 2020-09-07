(function () {
    'use strict';
    angular
        .module('jenis-dokumen-module', [])
        .factory('JenisDokumenFactory', JenisDokumenFactory);

    function JenisDokumenFactory($http, $state, $log, AppFactory, EnvironmentConfig) {
        return {
            getPagedJenisDokumen: getPagedJenisDokumen,
            getJenisDokumen: getJenisDokumen,
            deleteJenisDokumen: deleteJenisDokumen,
            querySearchJenisDokumen: querySearchJenisDokumen,
            cancelAction: cancelAction
        };

        function getPagedJenisDokumen(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_dokumen?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getJenisDokumen(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_dokumen/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function () {
                    $state.go('triangular.admin-default.jenis-dokumen');
                });
        }

        function deleteJenisDokumen(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'jenis_dokumen/' + id,
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

        function querySearchJenisDokumen(query) {
            return getJenisDokumenListService(query).then(function(res){
                return res.data.data.items;
            });
        }

        function getJenisDokumenListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_dokumen/list?q='+query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.jenis-dokumen');
        }
    }
})();
