(function() {
    'use strict';

    angular
        .module('jenis-proses-module')
        .controller('JenisProsesEditController', JenisProsesEditController);

    /* @ngInject */
    function JenisProsesEditController(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog,
        AppFactory, JenisProsesFactory, AlurProsesFactory
    ) {
        var vm = this;
        var id = $stateParams.id;
        
        /*** BEGIN - Main Form ***/
        vm.jenis_proses = {
            id : id,
            kode : '',
            nama_proses: '',
            tautan: '',
            kode_oss: '',
            is_drop: false
        };
        vm.jenis_proses = [];
        vm.tautanList = [];

        JenisProsesFactory.getJenisProses(id).then(function (res) {
            angular.copy(res.data.data, vm.jenis_proses);

            AlurProsesFactory.getTautanList().then(function(res) {
                vm.tautanList = res.data.data.items;
            });
        });

        vm.updateAction = updateAction;
        vm.cancelAction = JenisProsesFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'kode' : vm.jenis_proses.kode,
                'nama_proses': vm.jenis_proses.nama_proses,
                'tautan': vm.jenis_proses.tautan,
                'kode_oss': vm.jenis_proses.kode_oss,
                'is_drop': vm.jenis_proses.is_drop
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'jenis_proses/' + id,
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
        /*** END - End Form ***/
    }
})();
