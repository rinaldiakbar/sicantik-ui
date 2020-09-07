(function() {
    'use strict';

    angular
        .module('pengguna-module', [])

    .factory('PenggunaFactory', PenggunaFactory)

    .filter('username', function() {
        return function(input) {
            if (input) {
                var string = input.replace(/\s+/g, '_'); // Replace space with '_'
                string = string.replace(/-+/g, '_'); // Replace '-' with '_'
                string = string.toLowerCase(); // Set all character to lowerCase
                return string;
            }
        };
    });

    //PenggunaFactory.$inject = ['$http', EnvironmentConfig];

    function PenggunaFactory($http, EnvironmentConfig, $state, $log, AppFactory) {
        return {
            getPagedPengguna: getPagedPengguna,
            getPengguna: getPengguna,
            deletePengguna: deletePengguna,
            cancelAction: cancelAction,
            querySearchPeran: querySearchPeran,
            getPeranList: getPeranList,
            querySearchPegawai: querySearchPegawai,
            getPegawaiListService: getPegawaiListService,
            getUnitListService: getUnitListService,
            querySearchUnit: querySearchUnit,
            deleteUnit: deleteUnit,
            deleteJenisIzin: deleteJenisIzin,
            querySearchJenisIzin: querySearchJenisIzin,
            getJenisIzinListService: getJenisIzinListService,
            deleteJenisProses: deleteJenisProses,
            querySearchJenisProses: querySearchJenisProses
        };

        function getPagedPengguna(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pengguna?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function getPengguna(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pengguna/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.pengguna');
                });
        }

        function deletePengguna(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'pengguna/' + id,
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
            $state.go('triangular.admin-default.pengguna');
        }

        function querySearchPeran(query) {
            return getPeranList(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getPeranList(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'peran/list?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
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
                url: EnvironmentConfig.api + 'pegawai/list?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function querySearchUnit(query, peranId, instansiId) {
            return getUnitListService(query, peranId, instansiId).then(function(res) {
                return res.data.data.items;
            });
        }

        function getUnitListService(query, peranId, instansiId) {
            var requestUrl = EnvironmentConfig.api + 'unit/unitlist?q=' + query + '&peran_id=' + peranId;
            if (angular.isDefined(instansiId)) {
                requestUrl += '&instansi_id=' + instansiId;
            }

            var req = {
                method: 'GET',
                url: requestUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function deleteUnit(penggunaId, unitId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'pengguna/deleteunit/' + penggunaId + '/' + unitId,
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

        function deleteJenisIzin(penggunaId, jenisIzin) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'pengguna/deletejenisizin/' + penggunaId + '/' + jenisIzin,
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

        function querySearchJenisIzin(query) {
            return getJenisIzinListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getJenisIzinListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'JenisIzin/getlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function deleteJenisProses(penggunaId, jenisProses) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'pengguna/deletejenisproses/' + penggunaId + '/' + jenisProses,
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

        function querySearchJenisProses(query) {
            return getJenisProsesListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getJenisProsesListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'JenisProses/getlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }
    }
})();
