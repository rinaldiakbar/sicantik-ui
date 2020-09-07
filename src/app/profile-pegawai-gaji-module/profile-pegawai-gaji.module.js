(function() {
    'use strict';
    angular
        .module('profile-pegawai-gaji-module', [])
        .factory('ProfilePegawaiGajiFactory', ProfilePegawaiGajiFactory);

    function ProfilePegawaiGajiFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getPegawaiGajiList: getPegawaiGajiList,
            getPegawaiGaji: getPegawaiGaji,

            deleteGaji: deleteGaji,
            deletePajak: deletePajak,
            deleteAtributGaji: deleteAtributGaji,
            cancelAction: cancelAction
        };

        function getPegawaiGajiList(query) {
            var order = query.order === 'id' ? 'desc':'asc';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpegawaigaji?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
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

        function getPegawaiGaji(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpegawaigaji/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function(res) {
                    //console.log(res);
                })
                .error(function(err) {
                    console.log(err);
                });
        }

        function deleteGaji(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cpegawaigaji/deleteGaji/' + id,
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

        function deletePajak(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cpegawaigaji/deletePajak/' + id,
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

        function deleteAtributGaji(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cpegawaigaji/deleteAtributGaji/' + id,
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
            $state.go('triangular.admin-default.profile-pegawai-gaji');
        }
    }
})();
