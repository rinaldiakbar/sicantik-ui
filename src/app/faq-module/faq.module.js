
(function() {
    'use strict';

    angular
        .module('faq-module', [])
        .factory('FaqFactory', FaqFactory);

        function FaqFactory($http, $state, $log, EnvironmentConfig, AppFactory) {
            return {
                getPagedFaq: getPagedFaq,
                cancelAction: cancelAction
            };

            function getPagedFaq(query, categoryId) {
                var queryParams = {
                    'q': query.filter,
                    'page': query.page,
                    'limit': query.limit,
                    'is_active': 'T'
                };

                var url = EnvironmentConfig.api + 'faq';
                if (angular.isDefined(categoryId) && categoryId) {
                    queryParams.category_id = categoryId;
                }
                url += AppFactory.httpBuildQuery(queryParams);

                var req = {
                    method: 'GET',
                    url: url,
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

            function cancelAction() {
                $state.go('triangular.admin-default.faq');
            }
        }
})();