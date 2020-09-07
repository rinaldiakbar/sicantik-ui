(function() {
    'use strict';

    angular
        .module('faq-category-module', [])
        .factory('FaqCategoryFactory', FaqCategoryFactory);

    function FaqCategoryFactory($http, $log, EnvironmentConfig, $state, AppFactory, _) {
        return {
            getPagedFaq: getPagedFaq,
            getFaq: getFaq,
            deleteFaq: deleteFaq,
            cancelAction: cancelAction,
            querySearchCategory: querySearchCategory
        };

        function getPagedFaq(query, detail) {
            var queryParams = {
                'q': query.filter,
                'page': query.page
            };

            if (angular.isDefined(detail) && detail) {
                queryParams['is_detail'] = 'T';
                queryParams['is_active'] = 'T';
            }

            if (_.has(query, 'is_active')) {
                queryParams['is_active'] = query.is_active;
            }

            var url = EnvironmentConfig.api + 'faq_category';
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

        function getFaq(id) {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'faq_category/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .success(function(){})
                .error(function(err){
                    $log.error(err);
                    $state.go('triangular.admin-default.faq-category');
                });
        }
        function deleteFaq(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'faq_category/' + id,
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
            $state.go('triangular.admin-default.faq-category');
        }

        function querySearchCategory (query) {
            return getCategoryListService(query).then(function(res){
                return res.data.data.items;
            });
        }

        function getCategoryListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'faq_category/list?q='+query,
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
    }
})();
