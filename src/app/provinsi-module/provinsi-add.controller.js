(function() {
    'use strict';

    angular
        .module('provinsi-module')
        .controller('ProvinsiAddController', ProvinsiAddController);

    /* @ngInject */
    function ProvinsiAddController($http, $state, EnvironmentConfig, AppFactory, ProvinsiFactory) {
        var vm = this;
        vm.provinsi = {
            kode_daerah: '',
            nama_daerah: ''
        };

        vm.createAction = createAction;
        vm.cancelAction = ProvinsiFactory.cancelAction;

        function createAction() {
            var reqData = vm.provinsi;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'provinsi',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.provinsi');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
