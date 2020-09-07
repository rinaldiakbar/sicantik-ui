(function () {
    'use strict';
    angular
        .module('kamus-data-module', [])
        .factory('KamusDataFactory', KamusDataFactory)

        .filter('tableobject', function () {
            return function (input) {
                if (input) {
                    var string = input.replace(/\s+/g, '_'); // Replace space with '_'
                    string = string.replace(/-+/g, '_'); // Replace '-' with '_'
                    string = string.toLowerCase(); // Set all character to lowerCase
                    return string;
                }
            };
        })

        .directive('datatabelMaxlength', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attr, ngModel) {

                    var maxLength = attr.datatabelMaxlength;
                    var isCustom = attr.datatabelIscustom;

                    ngModel.$parsers.unshift(function (value) {
                        if (value && isCustom && value.length > maxLength) {
                            ngModel.$setValidity('datatabel-maxlength', false);
                            return undefined;
                        } else {
                            ngModel.$setValidity('datatabel-maxlength', true);
                            return value;
                        }
                    });

                }
            };
        });

    function KamusDataFactory($http, $log, $state, AppFactory, EnvironmentConfig) {
        return {
            getPagedDatatabel: getPagedDatatabel,
            getDatatabel: getDatatabel,
            getTipeKolomList: getTipeKolomList,
            deleteDatatabel: deleteDatatabel,
            deleteDataKolom: deleteDataKolom,
            cancelAction: cancelAction,
            querySearchUnit: querySearchUnit,
            deleteUnitDatatabel: deleteUnitDatatabel,
            getPagedRecords: getPagedRecords
        };

        function getPagedDatatabel(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'datatabel?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getDatatabel(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'datatabel/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function (err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.kamus-data');
                });
        }

        function getTipeKolomList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'datatabel/tipekolomlist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function deleteDatatabel(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'datatabel/' + id,
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

        function deleteDataKolom(dataKolomId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'datatabel/deletedatakolom/' + dataKolomId,
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

        function cancelAction() {
            $state.go('triangular.admin-default.kamus-data');
        }

        function querySearchUnit(query) {
            return getUnitListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getUnitListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/unitlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function deleteUnitDatatabel(unitDatatabelId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'UnitDatatabel/delete/' + unitDatatabelId,
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

        function getPagedRecords(id, query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'Datatabel/getRecords/' + id +
                    '?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.kamus-data');
                });
        }
    }
})();
