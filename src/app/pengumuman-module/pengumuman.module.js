(function() {
    'use strict';

    angular
        .module('pengumuman-module', [])
        .factory('PengumumanFactory', PengumumanFactory);

    function PengumumanFactory($http, $log, $state, AppFactory, EnvironmentConfig) {
        return {
            getPagedPengumuman: getPagedPengumuman,
            getPengumuman: getPengumuman,
            deletePengumuman: deletePengumuman,
            cancelAction: cancelAction,
            querySearchKecamatan: querySearchKecamatan,
            getKecamatanListService: getKecamatanListService
        };

        function getPagedPengumuman(query) {
            var kecamatanId = (angular.isDefined(query.kecamatan_id)) ? query.kecamatan_id : '';

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pesan?q='+query.filter+'&page='+
                    query.page+'&limit='+query.limit+'&kecamatan_id='+
                    kecamatanId + '&tipe=announcement',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }

        function getPengumuman(id) {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pesan/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err){
                    $log.error(err);
                    $state.go('triangular.admin-default.pengumuman');
                });
        }

        function deletePengumuman(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'pesan/' + id,
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
            $state.go('triangular.admin-default.pengumuman');
        }

        function querySearchKecamatan (query) {
            return getKecamatanListService(query).then(function(res){
                return res.data.data.items;
            });
        }

        function getKecamatanListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'kecamatan/list?q='+query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }
    }
})();
