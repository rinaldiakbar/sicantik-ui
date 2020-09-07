(function() {
    'use strict';

    angular
        .module('service-eksternal-module')
        .controller('ServiceEksternalEditController', ServiceEksternalEditController);

    /* @ngInject */
    function ServiceEksternalEditController($http, $state, $scope, EnvironmentConfig, $stateParams, AppFactory, ServiceEksternalFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.tipeOtentikasiList = [];

        vm.serviceEksternal = {
            id: id,
            nama: null,
            deskripsi: null,
            tipe_otentikasi: null,
            username: null,
            password: null
        };

        ServiceEksternalFactory.getServiceEksternal(id).then(function(res) {
            angular.copy(res.data.data, vm.serviceEksternal);

            ServiceEksternalFactory.getTipeOtentikasiList().then(function(res) {
                vm.tipeOtentikasiList = res.data.data.items;
            });
        });

        vm.updateAction = updateAction;
        vm.cancelAction = ServiceEksternalFactory.cancelAction;

        function updateAction() {
            var reqData = vm.serviceEksternal;
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'service_eksternal/' + id,
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
