(function () {
    'use strict';

    angular
        .module('jenis-dokumen-module')
        .controller('JenisDokumenEditController', JenisDokumenEditController);

    /* @ngInject */
    function JenisDokumenEditController($http, $state, $scope, EnvironmentConfig, ElementConfig, $stateParams, AppFactory, JenisDokumenFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.jenis_dokumen = {
            id: id,
            kode_daerah: '',
            nama_daerah: ''
        };

        JenisDokumenFactory.getJenisDokumen(id).then(function (res) {
            angular.copy(res.data.data, vm.jenis_dokumen);
        });

        vm.updateAction = updateAction;
        vm.cancelAction = JenisDokumenFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'kode': vm.jenis_dokumen.kode,
                'deskripsi': vm.jenis_dokumen.deskripsi
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'jenis_dokumen/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.jenis-dokumen');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
