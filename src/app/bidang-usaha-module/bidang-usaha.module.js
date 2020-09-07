(function() {
    'use strict';
    angular
        .module('bidang-usaha-module', [
        ])
        .factory('BidangUsahaFactory', BidangUsahaFactory);

    function BidangUsahaFactory($http, $state, $log, $mdToast, EnvironmentConfig, AppFactory) {
        return {
            getPagedBidangUsaha: getPagedBidangUsaha,
            getBidangUsaha: getBidangUsaha,
            deleteBidangUsaha: deleteBidangUsaha,
            cancelAction: cancelAction
        };

        function getPagedBidangUsaha(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'bidang_usaha?q='+query.filter+'&page='+query.page+'&limit='+query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }

        function getBidangUsaha(id) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'bidang_usaha/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err){
                    $log.error(err);
                    $state.go('triangular.admin-default.bidang-usaha');
                });
        }

        function deleteBidangUsaha(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'bidang_usaha/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                })
                .error(function(err){
                    $log.error(err);
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.bidang-usaha');
        }
    }
})();
