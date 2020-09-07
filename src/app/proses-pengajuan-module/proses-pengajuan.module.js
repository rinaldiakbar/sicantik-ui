(function() {
    'use strict';
    angular
        .module('proses-pengajuan-module', [
        ])
        .factory('ProsesPengajuanFactory', ProsesPengajuanFactory);

        function ProsesPengajuanFactory($http, EnvironmentConfig, $state, AppFactory) {
            return {
                getPagedProsesPengajuan: getPagedProsesPengajuan,
                getProsesPengajuan: getProsesPengajuan,
                deleteProsesPengajuan: deleteProsesPengajuan,
                cancelAction: cancelAction,
                getProsesPermohonan: getProsesPermohonan,
                getPagedProsesNib: getPagedProsesNib
            };

            function getPagedProsesPengajuan(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'permohonan_izin?q='+query.filter+'&page='+query.page+
                                        '&limit='+query.limit+'&order='+query.order,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res){
                        //console.log(res);
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }

            function getProsesPengajuan(id) {
                // GET the original Data
                var getDataReq = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'permohonan_izin/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(getDataReq)
                    .success(function(res){
                    })
                    .error(function(err){
                        console.log(err);
                        $state.go('triangular.admin-default.proses-pengajuan');
                    });
            }

            function deleteProsesPengajuan(id) {
                var req = {
                    method: 'DELETE',
                    url: EnvironmentConfig.api + 'ProsesPengajuan/delete/' + id,
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
                $state.go('triangular.admin-default.proses-pengajuan');
            }

            function getJenisPermohonanList() {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'jenis_pengajuan/jenislist',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res){
                        //console.log(res);
                    })
                    .error(function(err){
                        console.log(err);
                    });
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
                    .success(function(res){
                        //console.log(res);
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }

            function getPagedProsesNib(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'permohonan_izin/listNib?q='+query.filter+'&page='+query.page+
                                        '&limit='+query.limit+'&order='+query.order,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res){
                        //console.log(res);
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }
        }
})();
