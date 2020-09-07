(function() {
    'use strict';

    angular
        .module('app.admin.authentication')
        .controller('ForgotController', ForgotController);

    /* @ngInject */
    function ForgotController(
        $scope, $state, $mdToast, $filter, $http,
        triSettings, EnvironmentConfig, AppFactory
    ) {
        var vm = this;
        vm.triSettings = triSettings;
        vm.user = {
            username: ''
        };
        vm.resetClick = resetClick;

        ////////////////

        function resetClick() {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pengguna/forgotpassword',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: vm.user
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
