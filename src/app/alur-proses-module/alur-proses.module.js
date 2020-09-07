(function() {
    'use strict';
    angular
        .module('alur-proses-module', [])
        .factory('AlurProsesFactory', AlurProsesFactory);

    function AlurProsesFactory($http, EnvironmentConfig, $log, $state, AppFactory) {
        return {
            getPagedAlurProses: getPagedAlurProses,
            getAlurProses: getAlurProses,
            deleteAlurProses: deleteAlurProses,
            deleteDaftarProses: deleteDaftarProses,
            cancelAction: cancelAction,
            querySearchJenisProses: querySearchJenisProses,
            querySearchForm: querySearchForm,
            querySearchTemplateData: querySearchTemplateData,
            getTipeProsesList: getTipeProsesList,
            getTautanList: getTautanList,
            copyAlurProses: copyAlurProses
        };

        function getPagedAlurProses(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'alur_proses?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function getAlurProses(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'alur_proses/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function(err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.alur-proses');
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
                url: EnvironmentConfig.api + 'jenis_proses/list?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function querySearchForm(query) {
            return getFormListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getFormListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'form/getlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function querySearchTemplateData(query) {
            return getTemplateDataListService(query).then(function(res) {
                return res.data.data.items;
            });
        }

        function getTemplateDataListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'TemplateData/getreportlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function deleteAlurProses(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'alur_proses/' + id,
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

        function deleteDaftarProses(daftarProsesId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'daftar_proses/' + daftarProsesId,
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
            $state.go('triangular.admin-default.alur-proses');
        }

        function getTipeProsesList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'AlurProses/gettipeproses',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function getTautanList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'alur_proses/tautanlist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function copyAlurProses(id) {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'AlurProses/copyalur/' + id,
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
    }
})();