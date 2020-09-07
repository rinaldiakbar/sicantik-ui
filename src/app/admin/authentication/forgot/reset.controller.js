(function() {
    'use strict';

    angular
        .module('app.admin.authentication')
        .controller('ResetController', ResetController);

    /* @ngInject */
    function ResetController(
        $state, $stateParams, $http, $log,
        triSettings, EnvironmentConfig, AppFactory
    ) {
        var vm = this;
        var token = $stateParams.token;
        vm.triSettings = triSettings;
        vm.pengguna = {
            token: token,
            password: null,
            confirm: null
        };

        checkToken();

        vm.changePassword = changePassword;

        ////////////////
        function checkToken() {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pengguna/checkresettoken',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: vm.pengguna
            };

            $http(req)
                .error(function (err) {
                    $state.go('authentication.login');
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function changePassword() {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pengguna/resetpassword',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: vm.pengguna
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('authentication.login');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
