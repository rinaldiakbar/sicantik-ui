(function () {
    'use strict';

    angular
        .module('perusahaan-module', [])
        .factory('PerusahaanFactory', PerusahaanFactory);

    /** Perusahaan Factory **/
    function PerusahaanFactory($http, $log, EnvironmentConfig, AppFactory) {
        return {
            getPagedPerusahaan: getPagedPerusahaan,
            getPerusahaan: getPerusahaan,
            getStructure: getStructure,
            getNewStructure: getNewStructure,
            getDirkom: getDirkom,
            getPemegangSaham: getPemegangSaham,
            getChartSaham: getChartSaham,
            getChartPerforma: getChartPerforma,
            querySearchPerusahaan: querySearchPerusahaan,
            deletePerusahaanSaham: deletePerusahaanSaham
        };

        function getPagedPerusahaan(query) {
            var order = query.order === 'id' ? 'desc' : 'asc';
            var url = EnvironmentConfig.api + 'perusahaan?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit + '&order=' + order;

            if (angular.isDefined(query.pemohon_id)) {
                url += '&pemohon_id=' + query.pemohon_id;
            }

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getPerusahaan(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cperusahaan/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .success(function () {
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getStructure() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cperusahaan/getStructure',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function () {
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getNewStructure() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cperusahaan/nestedstructure',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function () {
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getPemegangSaham(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cperusahaan/getPemegangSaham/' + id,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getDirkom(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cperusahaan/getDirkom/' + id,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getChartSaham(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cperusahaan/getChartSaham/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function () {
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getChartPerforma(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cperusahaan/getChartPerforma/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function () {
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchPerusahaan(query) {
            return getPerusahaanListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getPerusahaanListService(query) {
            var params = {
                'q': query
            };

            var queryString = AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cperusahaan/getList' + queryString,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function () {
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function deletePerusahaanSaham(perusahaanSahamId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cperusahaan/deletePerusahaanSaham/' + perusahaanSahamId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }

    /** .Perusahaan Factory **/
})();
