(function() {
    'use strict';
    angular
        .module('profile-pegawai-module', [])
        .factory('ProfilePegawaiFactory', ProfilePegawaiFactory);

    function ProfilePegawaiFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getProfileList: getProfileList,
            getProfilePegawai: getProfilePegawai,

            deleteProfilePegawai: deleteProfilePegawai,
            deletePegawaiAtribut: deletePegawaiAtribut,
            cancelAction: cancelAction
        };

        function getProfileList(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpegawai?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function getProfilePegawai(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpegawai/view/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function(err) {
                    $log.error(err);
                });
        }

        function deleteProfilePegawai(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cpegawai/delete/' + id,
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

        function deletePegawaiAtribut(pegawaiAtributId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cpegawai/deleteAtribut/' + pegawaiAtributId,
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
            $state.go('triangular.admin-default.profile-pegawai');
        }
    }
})();
