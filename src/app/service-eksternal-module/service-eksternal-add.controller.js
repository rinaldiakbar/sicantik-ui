(function() {
    'use strict';

    angular
        .module('service-eksternal-module')
        .controller('ServiceEksternalAddController', ServiceEksternalAddController);

    /* @ngInject */
    function ServiceEksternalAddController($http, $state, $log, EnvironmentConfig, AppFactory, ServiceEksternalFactory) {
        var vm = this;
        vm.tipeOtentikasiList = [];

        vm.serviceEksternal = {
            nama: null,
            deskripsi: null,
            tipe_otentikasi: 'No Authentication',
            username: null,
            password: null
        };

        ServiceEksternalFactory.getTipeOtentikasiList().then(function(res) {
            vm.tipeOtentikasiList = res.data.data.items;
        });

        vm.createAction = createAction;
        vm.cancelAction = ServiceEksternalFactory.cancelAction;

        function createAction() {
            var reqData = vm.serviceEksternal;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'service_eksternal',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.service-eksternal');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
