(function() {
    'use strict';

    angular
        .module('penanganan-aduan-module', [])
        .factory('PenangananAduanFactory', PenangananAduanFactory);

        function PenangananAduanFactory($http, EnvironmentConfig, $state, AppFactory) {
            return {
                getPagedPenangananAduan: getPagedPenangananAduan,
                getAduan: getAduan,
                getPenangananAduan: getPenangananAduan,
                deleteAduan: deleteAduan,
                cancelAction: cancelAction,
                querySearchPegawai: querySearchPegawai,
                getPegawaiListService: getPegawaiListService,
                querySearchKategori:querySearchKategori,
                getKategoriListService: getKategoriListService,
                getFormatNumber:getFormatNumber
            };

            function getFormatNumber() {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'caduan/getNumber',
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

            function querySearchKategori(query) {
                return getKategoriListService(query).then(function(res) {
                    return res.data.data.items;
                });
            }

            function getKategoriListService(query) {
                var params = {
                    'q': query
                };

                var queryString = AppFactory.httpBuildQuery(params);

                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'caduan/getKategoriList' + queryString,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };

                return $http(req)
                    .success(function() {
                    })
                    .error(function(err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }

            function querySearchPegawai(query) {
                return getPegawaiListService(query).then(function(res) {
                    return res.data.data.items;
                });
            }

            function getPegawaiListService(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'pegawai/getListPenanggungJawab?q=' + query,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res) {
                    })
                    .error(function(err) {
                        console.log(err);
                    });
            }

            function getPagedPenangananAduan(query) {
                var order = query.order === 'id' ? 'desc':'asc';
                var kecamatanId = (typeof(query.kecamatan_id)!=='undefined') ? query.kecamatan_id : '';
                if(query.kategori){
                    query.kategori = query.kategori.replace("&", "%26");
                }
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'caduan/penangananAduanList?q='+query.filter+'&page='+query.page+'&limit='+query.limit+ '&status=' + query.status + '&kategori=' + query.kategori,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res){
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }

            function getAduan(id) {
                var getDataReq = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'caduan/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(getDataReq)
                    .success(function(res){
                    })
                    .error(function(err){
                        console.log(err);
                        $state.go('triangular.admin-default.Aduan');
                    });
            }

            function getPenangananAduan(id) {
                var getDataReq = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'caduan/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(getDataReq)
                    .success(function(res){
                    })
                    .error(function(err){
                        console.log(err);
                        $state.go('triangular.admin-default.Aduan');
                    });
            }

            function deleteAduan(id) {
                var req = {
                    method: 'DELETE',
                    url: EnvironmentConfig.api + 'caduan/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res){
                        AppFactory.showToast(res.message);
                        $state.reload();
                    })
                    .error(function(err){
                        AppFactory.showToast(err.message, 'error', err.errors);
                    });
            }

            function cancelAction() {
                $state.go('triangular.admin-default.penanganan-aduan');
            }
        }
})();
