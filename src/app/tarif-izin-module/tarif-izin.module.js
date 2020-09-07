(function() {
    'use strict';
    angular
        .module('tarif-izin-module', [
        ])
        .factory('TarifIzinFactory', TarifIzinFactory);

    function TarifIzinFactory($http, $log, $state, EnvironmentConfig, AppFactory) {
        return {
            getPagedJenisIzin: getPagedJenisIzin,
            getJenisIzin: getJenisIzin,
            getPagedTarifItem: getPagedTarifItem,
            getTarifItem: getTarifItem,
            deleteTarifItem: deleteTarifItem,
            deleteTarifHarga: deleteTarifHarga,
            cancelAction: cancelAction,
            cancelTarifItemAction: cancelTarifItemAction
        };

        function getPagedJenisIzin(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_izin?q='+query.filter+'&page='+query.page+'&limit='+query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }

        function getJenisIzin(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_izin/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err){
                    $log.error(err);
                    $state.go('triangular.admin-default.tarif-izin');
                });
        }

        function getPagedTarifItem(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'tarif_item?izin_id=' + query.izin_id + '&q='+query.filter+'&page='+query.page+'&limit='+query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
              .error(function(err){
                  $log.error(err);
              });
        }

        function getTarifItem(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'tarif_item/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
              .error(function(err){
                  $log.error(err);
                  $state.go('triangular.admin-default.tarif-izin');
              });
        }

        function deleteTarifItem(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'tarif_item/' + id,
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

        function deleteTarifHarga(tarifHargaId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'TarifItem/deletetarifharga/' + tarifHargaId,
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
            $state.go('triangular.admin-default.tarif-izin');
        }

        function cancelTarifItemAction(jenisIzinId) {
            $state.go('triangular.admin-default.tarif-item', {'jenis_izin_id': jenisIzinId});
        }
    }
})();
