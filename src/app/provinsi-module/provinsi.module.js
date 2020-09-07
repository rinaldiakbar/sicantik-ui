(function() {
    'use strict';
    angular
        .module('provinsi-module', [
        ])
        .factory('ProvinsiFactory', ProvinsiFactory);

    function ProvinsiFactory($http, $state, $log, EnvironmentConfig, AppFactory) {
        return {
            getPagedProvinsi: getPagedProvinsi,
            getProvinsi: getProvinsi,
            deleteProvinsi: deleteProvinsi,
            cancelAction: cancelAction
        };

        function getPagedProvinsi(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'provinsi?q='+query.filter+'&page='+query.page+'&limit='+query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }

        function getProvinsi(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'provinsi/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err){
                    $log.error(err);
                    $state.go('triangular.admin-default.provinsi');
                });
        }

        function deleteProvinsi(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'provinsi/' + id,
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
            $state.go('triangular.admin-default.provinsi');
        }
    }
})();
