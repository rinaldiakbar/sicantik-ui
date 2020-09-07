(function() {
    'use strict';
    angular
        .module('simulasi-tarif-module', [
        ])
        .factory('SimulasiTarifFactory', SimulasiTarifFactory);

    function SimulasiTarifFactory($http, $log, EnvironmentConfig) {
        return {
            getFormSimulasiTarif: getFormSimulasiTarif
        };

        function getFormSimulasiTarif(jenisIzinId) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'FormulaRetribusi/getFormSimulasi/' + jenisIzinId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
              .error(function(err){
                  $log.error(err);
              });
        }
    }
})();
