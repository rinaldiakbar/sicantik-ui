(function() {
    'use strict';

    angular
        .module('pemohon-register-module', [
        ])
        .factory('PemohonRegisterFactory', PemohonRegisterFactory);

        /*** PemohonRegister Factory ***/
        function PemohonRegisterFactory($http, $state, $log, EnvironmentConfig, APP_CONFIG, AppFactory) {
            return {
                getPagedPemohonRegister: getPagedPemohonRegister,
                deletePemohonRegister: deletePemohonRegister,
                approvePemohonRegister: approvePemohonRegister,
                cancelAction: cancelAction
            };

            ///////////

            function getPagedPemohonRegister(query) {
                var order = query.order === 'id' ? 'desc' : 'asc';

                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'pemohon?q=' + query.filter +
                    '&page=' + query.page + '&limit=' + query.limit + '&order=' + order +
                    '&data_status=pending',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function (res) {
                        //console.log(res);
                    })
                    .error(function (err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }

            function deletePemohonRegister(id) {
                var req = {
                    method: 'DELETE',
                    url: EnvironmentConfig.api + 'pemohon/' + id,
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


            function approvePemohonRegister(id) {
                var req = {
                    method: 'POST',
                    url: EnvironmentConfig.api + 'pemohon/approve/' + id,
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
                $state.go('triangular.admin-default.pemohon-register-list');
            }
        }
})();
