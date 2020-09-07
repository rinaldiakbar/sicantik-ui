(function() {
    'use strict';
    angular
        .module('profile-pegawai-time-module', [])
        .factory('ProfilePegawaiTimeFactory', ProfilePegawaiTimeFactory);

    function ProfilePegawaiTimeFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getPegawaiTimeList: getPegawaiTimeList,
            getPegawaiTime: getPegawaiTime,

            deletePegawaiShift: deletePegawaiShift,
            deletePegawaiIzin: deletePegawaiIzin,
            cancelAction: cancelAction
        };

        function getPegawaiTimeList(query) {
            var order = query.order === 'id' ? 'desc':'asc';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpegawaitime?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
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

        function getPegawaiTime(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpegawaitime/' + id,
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

        function deletePegawaiShift(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cpegawaitime/deleteShift/' + id,
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

        function deletePegawaiIzin(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cpegawaitime/deleteIzin/' + id,
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
            $state.go('triangular.admin-default.profile-pegawai-time');
        }
    }
})();
