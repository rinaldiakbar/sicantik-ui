(function() {
    'use strict';
    angular
        .module('daftar-izin-module', [])
        .factory('DaftarIzinFactory', DaftarIzinFactory);

    function DaftarIzinFactory($http, EnvironmentConfig, $state, $log, AppFactory) {
        return {
            getPagedDaftarIzin: getPagedDaftarIzin,
            getDaftarIzin: getDaftarIzin,
            deleteDaftarIzin: deleteDaftarIzin,
            cancelAction: cancelAction,
            getProsesPermohonan: getProsesPermohonan,
            mapLink: mapLink
        };

        function getPagedDaftarIzin(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'izin?q='+query.filter+'&page='+query.page+'&limit='+query.limit+'&order='+query.order,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }

        function getDaftarIzin(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'permohonan_izin/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err){
                    $log.error(err);
                    $state.go('triangular.admin-default.daftar-izin');
                });
        }

        function deleteDaftarIzin(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'DaftarIzin/delete/' + id,
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
            $state.go('triangular.admin-default.daftar-izin');
        }

        function getProsesPermohonan(permohonanIzinId) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'PermohonanIzin/getprosespermohonan/' + permohonanIzinId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err){
                    $log.error(err);
                });
        }

        function mapLink(tautan) {
            // Map the link so that user cannot access the edit form
            // always use state for the right side to prevent invalid URL generation
            var mapLinks = {
                'permohonan-izin/add': 'permohonan-izin-view',
                'permohonan-izin-add': 'permohonan-izin-view',
                'permohonan-izin/edit': 'permohonan-izin-view',
                'permohonan-izin-edit': 'permohonan-izin-view',
                'form/add': 'form-view',
                'form-add': 'form-view',
                'form/edit': 'form-view',
                'form-edit': 'form-view'
            };

            if (mapLinks.hasOwnProperty(tautan)) {
                tautan = mapLinks[tautan];
            }

            return tautan;
        }
    }
})();
