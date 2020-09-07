(function() {
    'use strict';

    angular
        .module('jenis-proses-module')
        .controller('JenisProsesAddController', JenisProsesAddController);

    /* @ngInject */
    function JenisProsesAddController(
        $http, $state, EnvironmentConfig, $mdDialog,
        AppFactory, JenisProsesFactory, AlurProsesFactory
    ) {
        var vm = this;

        /*** BEGIN - Main Form ***/
        vm.jenis_proses = {
            kode: '',
            nama_proses: '',
            tautan: '',
            kode_oss: '',
            is_drop: false
        };
        vm.tautanList = [];

        vm.createAction = createAction;
        vm.cancelAction = JenisProsesFactory.cancelAction;

        AlurProsesFactory.getTautanList().then(function(res) {
            vm.tautanList = res.data.data.items;
        });

        function createAction() {
            var reqData = {
                'kode' : vm.jenis_proses.kode,
                'nama_proses': vm.jenis_proses.nama_proses,
                'tautan': vm.jenis_proses.tautan,
                'kode_oss': vm.jenis_proses.kode_oss,
                'is_drop': vm.jenis_proses.is_drop
            };

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'jenis_proses',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.jenis-proses');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** End - Main Form ***/
    }
})();
