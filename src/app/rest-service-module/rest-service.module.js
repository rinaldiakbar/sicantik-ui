(function() {
    'use strict';

    angular
        .module('rest-service-module', [])

    .factory('RestServiceFactory', RestServiceFactory)

    .filter('username', function() {
        return function(input) {
            if (input) {
                var string = input.replace(/\s+/g, '_'); // Replace space with '_'
                string = string.replace(/-+/g, '_'); // Replace '-' with '_'
                string = string.toLowerCase(); // Set all character to lowerCase
                return string;
            }
        };
    });

    //rest-serviceFactory.$inject = ['$http', EnvironmentConfig];

    function RestServiceFactory($http, $log, $state, EnvironmentConfig, AppFactory) {
        return {
            getPagedRestService: getPagedRestService,
            getRestService: getRestService,
            deleteRestService: deleteRestService,
            cancelAction: cancelAction
        };

        function getPagedRestService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'rest_services?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
              .error(function(err) {
                  $log.error(err);
              });
        }

        function getRestService(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'rest_services/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.rest-service');
                });
        }

        function deleteRestService(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'rest_services/' + id,
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
            $state.go('triangular.admin-default.rest-service');
        }
    }
})();
