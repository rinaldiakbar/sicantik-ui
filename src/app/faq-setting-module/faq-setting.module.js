(function() {
    'use strict';

    angular
        .module('faq-setting-module', [
        ])

        .factory('FaqSettingFactory', FaqSettingFactory);

        function FaqSettingFactory($http, $log, EnvironmentConfig, $state, AppFactory) {
            return {
                getPagedFaq: getPagedFaq,
                getFaq: getFaq,
                deleteFaq: deleteFaq,
                cancelAction: cancelAction
            };

            function getPagedFaq(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'faq?q='+query.filter+'&page='+query.page+'&limit='+query.limit,
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
                    url: EnvironmentConfig.api + 'faq/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(getDataReq)
                    .success(function(){})
                    .error(function(err){
                        $log.error(err);
                        $state.go('triangular.admin-default.faq-setting');
                    });
            }
            function deleteFaq(id) {
                var req = {
                    method: 'DELETE',
                    url: EnvironmentConfig.api + 'faq/' + id,
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
                $state.go('triangular.admin-default.faq-setting');
            }
        }
})();
