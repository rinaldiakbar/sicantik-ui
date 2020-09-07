(function() {
    'use strict';
    angular
        .module('kalender-module', [])
        .factory('KalenderFactory', KalenderFactory);

    function KalenderFactory($http, $log, $state, AppFactory, EnvironmentConfig) {
            return {
                getKalender: getKalender,
                getHariListService: getHariListService,
                deleteKalender: deleteKalender,
                cancelAction: cancelAction
            };

            function getKalender(instansiId) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'kalender/getkalender/' + instansiId,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .error(function(err){
                    $log.error(err);
                    });
            }

            function getHariListService() {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'kalender/getharilist',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .error(function(err){
                    $log.error(err);
                    });
            }

            function deleteKalender(id) {
                var req = {
                    method: 'DELETE',
                    url: EnvironmentConfig.api + 'kalender/' + id,
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
                $state.go('triangular.admin-default.kalender');
            }
        }
})();