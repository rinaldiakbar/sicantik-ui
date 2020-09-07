(function() {
    'use strict';
    angular
        .module('kabupaten-module', [
        ])

        .factory('KabupatenFactory', KabupatenFactory);

        function KabupatenFactory($http, $log, EnvironmentConfig, $state, AppFactory) {
            return {
                getPagedKabupaten: getPagedKabupaten,
                getKabupaten: getKabupaten,
                deleteKabupaten: deleteKabupaten,
                cancelAction: cancelAction,
                querySearchProvinsi: querySearchProvinsi,
                getProvinsiListService: getProvinsiListService
            };

            function getPagedKabupaten(query) {
            var provinsiId = (angular.isDefined(query.provinsi_id)) ? query.provinsi_id : '';

                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'kabupaten?q='+query.filter+'&page='+query.page+'&limit='+query.limit+'&provinsi_id='+provinsiId,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(){})
                    .error(function(err){
                        $log.error(err);
                    });
            }

            function getKabupaten(id) {
                // GET the Navigation Data
                var getDataReq = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'kabupaten/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(getDataReq)
                    .success(function(){ })
                    .error(function(err){
                        $log.error(err);
                        $state.go('triangular.admin-default.kabupaten');
                    });
            }

            function deleteKabupaten(id) {
                var req = {
                    method: 'DELETE',
                    url: EnvironmentConfig.api + 'kabupaten/' + id,
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
                $state.go('triangular.admin-default.kabupaten');
            }

            function querySearchProvinsi (query) {
            return getProvinsiListService(query).then(function (res) {
                    return res.data.data.items;
                });
            }

            function getProvinsiListService(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'provinsi/list?q='+query,
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
