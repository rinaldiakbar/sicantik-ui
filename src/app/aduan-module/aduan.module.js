(function() {
    'use strict';
    angular
        .module('aduan-module', [])
        .factory('AduanFactory', AduanFactory);

    function AduanFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getAduan: getAduan,
            getAduanList: getAduanList,
            getFormatNumber:getFormatNumber,
            querySearchKategori:querySearchKategori,
            cancelAction: cancelAction,
            openAduan: openAduan
        };

        function getAduan(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'caduan/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function(res) {})
                .error(function(err) {
                    console.log(err);
                });
        }

        function getAduanList(query) {
            var order = query.order === 'id' ? 'desc':'asc';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'caduan?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit
                    + '&status=' + query.status + '&kategori=' + query.kategori,
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

        function cancelAction() {
            $state.go('triangular.admin-default.aduan');
        }

        function openAduan(id, params) {
            var reqData = {
                'status': params
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'caduan/reOpenStatus/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            return $http(req)
                .success(function(res) {})
                .error(function(err) {
                    console.log(err);
                });
        }
    }
})();