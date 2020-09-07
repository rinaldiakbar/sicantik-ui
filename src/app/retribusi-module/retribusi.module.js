(function() {
    'use strict';
    angular
        .module('retribusi-module', [])
        .factory('RetribusiFactory', RetribusiFactory);

    function RetribusiFactory($http, $log, $mdToast, $state, EnvironmentConfig) {
        return {
            getFormRetribusi: getFormRetribusi,
            cancelAction: cancelAction
        };

        function getFormRetribusi(permohonanIzinId) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'FormulaRetribusi/getFormRetribusi/' + permohonanIzinId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
              .error(function(err){
                  $log.error(err);
                  $state.go('triangular.admin-default.retribusi');
              });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.proses-pengajuan');
        }
    }
})();
