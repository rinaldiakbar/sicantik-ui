(function() {
    'use strict';
    angular
        .module('profile-module', [])
        .factory('profileFactory', profileFactory);

    function profileFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getAgamaList: getAgamaList,
            getBloodList: getBloodList,
            getGenderList: getGenderList,
            getProfileList: getProfileList,
            getProfilePegawai: getProfilePegawai,

            deleteProfilePegawai: deleteProfilePegawai,
            deletePegawaiAtribut: deletePegawaiAtribut,
            cancelAction: cancelAction
        };

        function getAgamaList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpersonal/getagamalist',
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

        function getBloodList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpersonal/getbloodlist',
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

        function getGenderList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpersonal/getgenderlist',
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

        function getProfileList(query) {
            var order = query.order === 'id' ? 'desc':'asc';
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpersonal?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
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

        function getProfilePegawai(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'cpersonal/view/' + id,
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

        function deleteProfilePegawai(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'cpersonal/delete/' + id,
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
                url: EnvironmentConfig.api + 'cpersonal/delete/' + pegawaiAtributId,
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
            $state.go('triangular.admin-default.profile-personal');
        }
    }
})();
