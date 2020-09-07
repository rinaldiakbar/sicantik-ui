(function () {
    'use strict';

    angular
        .module('unit-module', [])

        // Checkbox for View Only
        .directive('unitTreeActions', unitTreeActions)

        .factory('UnitFactory', UnitFactory);

    function unitTreeActions($state, APP_CONFIG, AppFactory) {
        var user = angular.fromJson(localStorage.getItem(APP_CONFIG.localStorageKey));

        return {
            restrict: 'AE',
            require: '^ivhTreeview',
            scope: {
                itemId: '='
            },
            template: [
                '<button class="btn btn-success btn-circle" type="button" ng-click="showFormEdit(itemId)">',
                '<i class="fa fa-pencil"></i>',
                '</button>&nbsp;',
                '<button class="btn btn-info btn-circle" type="button" ng-click="showFormView(itemId)">',
                '<i class="fa fa-eye"></i>',
                '</button>&nbsp;'
            ].join(''),
            link: function (scope/*, element, attrs, ctrl*/) {
                scope.showFormEdit = function (id) {
                    if (user.unit_id && user.unit_id != id) {
                        AppFactory.showToast('Anda tidak dapat mengubah data instansi', 'error');
                    } else {
                        $state.go('triangular.admin-default.unit-edit', {'id': id});
                    }
                };

                scope.showFormView = function (id) {
                    $state.go('triangular.admin-default.unit-view', {'id': id});
                };
            }
        };
    }

    function UnitFactory($http, EnvironmentConfig, $mdToast, $state, AppFactory) {
        return {
            getPagedUnit: getPagedUnit,
            getPagedInstansi: getPagedInstansi,
            getHierarchicalUnit: getHierarchicalUnit,
            getUnit: getUnit,
            deleteUnit: deleteUnit,
            cancelAction: cancelAction,
            querySearchStruktur: querySearchStruktur,
            querySearchUnit: querySearchUnit,
            querySearchInstansi: querySearchInstansi,
            getInstansiListService: getInstansiListService,
            querySearchInstansiPublic: querySearchInstansiPublic,
            getUnitListService: getUnitListService,
            getTipeListService: getTipeListService,
            querySearchKodeDaerah: querySearchKodeDaerah,
            getStructure: getStructure
        };

        function getPagedUnit(query) {
            var order = query.order === 'id' ? 'desc' : 'asc';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit + '&tipe=U&order=' + order,
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

        function getPagedInstansi(query) {
            var order = query.order === 'id' ? 'desc' : 'asc';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit + '&tipe=I&order=' + order,
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

        function getHierarchicalUnit() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/hierarchy',
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

        function getStructure(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/getStructure/' + id,
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

        function getUnit(id) {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/' + id,
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
                    $state.go('triangular.admin-default.unit');
                });
        }

        function deleteUnit(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'unit/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    if (res.message) {
                        AppFactory.showToast(res.message);
                    }
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.unit');
        }

        function querySearchStruktur(query, tipeUnit) {
            switch (tipeUnit) {
                case 'I':
                    return getUnitListService(query).then(function (res) {
                        return res.data.data.items;
                    });
                case 'U':
                    return getInstansiListService(query).then(function (res) {
                        return res.data.data.items;
                    });
                default:
                    break;
            }
        }

        function querySearchUnit(query, instansiId) {
            return getUnitListService(query, instansiId).then(function (res) {
                return res.data.data.items;
            });
        }

        function querySearchInstansi(query) {
            return getInstansiListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function querySearchInstansiPublic(query) {
            return getInstansiPublicListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function querySearchKodeDaerah(query) {
            return getKodeDaerahListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getKodeDaerahListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/getdaerahlist?q=' + query,
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

        function getUnitListService(query, instansiId) {
            var params = {
                'q': query
            };

            if (angular.isDefined(instansiId)) {
                params.instansi_id = instansiId;
            }

            var queryString = AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/unitlist' + queryString,
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

        function getInstansiListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/instansilist?q=' + query,
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

        function getInstansiPublicListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/instansipubliclist?q=' + query,
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

        function getTipeListService() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/tipelist',
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

    }

})();