(function () {
    'use strict';

    angular
        .module('jenis-dokumen-module')
        .controller('JenisDokumenAddController', JenisDokumenAddController);

    /* @ngInject */
    function JenisDokumenAddController($http, $state, EnvironmentConfig, AppFactory, JenisDokumenFactory) {
        var vm = this;
        vm.jenis_dokumen = {
            kode_daerah: '',
            nama_daerah: ''
        };

        vm.createAction = createAction;
        vm.cancelAction = JenisDokumenFactory.cancelAction;

        function createAction() {
            var reqData = vm.jenis_dokumen;

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'jenis_dokumen',
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
