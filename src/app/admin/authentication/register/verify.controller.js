(function() {
    'use strict';

    angular
        .module('app.admin.authentication')
        .controller('VerifyController', VerifyController);

    /* @ngInject */
    function VerifyController(
        $state, $stateParams, $http, $log,
        triSettings, EnvironmentConfig, AppFactory
    ) {
        var vm = this;
        var token = $stateParams.token;

        vm.isValidToken = false;
        vm.isInvalidToken = false;
        vm.triSettings = triSettings;
        vm.pengguna = {
            token: token
        };

        checkToken();

        vm.doVerify = doVerify;

        ////////////////             
        function checkToken() {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pemohon/checkverifytoken',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: vm.pengguna
            };

            $http(req)
                .success(function () {
                    vm.isValidToken = true;
                })
                .error(function (err) {
                    vm.isInvalidToken = true;
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function doVerify() {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pemohon/verify',
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
