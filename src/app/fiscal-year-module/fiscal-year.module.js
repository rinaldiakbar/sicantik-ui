(function() {
    'use strict';
    angular
        .module('fiscal-year-module', [])
        .factory('FiscalYearFactory', FiscalYearFactory);

    function FiscalYearFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getFiscalYearList: getFiscalYearList,
            getFiscalYear: getFiscalYear,

            deleteFiscalYear: deleteFiscalYear,
            deleteLedger: deleteLedger,
            cancelAction: cancelAction
        };

        function getFiscalYearList(query) {
            var order = query.order === 'id' ? 'desc':'asc';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cfiscalyear?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function() {})
                .error(function(err) {
                    console.log(err);
                });
        }

        function getFiscalYear(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cfiscalyear/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function(res) {
                    //console.log(res);
                })
                .error(function(err) {
                    console.log(err);
                });
        }

        function deleteFiscalYear(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cfiscalyear/' + id,
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

        function deleteLedger(ledgerId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cfiscalyear/deleteLedger/' + ledgerId,
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
            $state.go('triangular.admin-default.fiscal-year');
        }
    }
})();
