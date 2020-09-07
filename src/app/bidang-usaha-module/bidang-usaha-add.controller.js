(function() {
    'use strict';

    angular
        .module('bidang-usaha-module')
        .controller('BidangUsahaAddController', BidangUsahaAddController);

    /* @ngInject */
    function BidangUsahaAddController($http, $state, EnvironmentConfig, AppFactory, BidangUsahaFactory) {
        var vm = this;
        vm.bidang_usaha = {
            kode: '',
            keterangan: ''
        };

        vm.createAction = createAction;
        vm.cancelAction = BidangUsahaFactory.cancelAction;

        function createAction() {
            var reqData = vm.bidang_usaha;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'bidang_usaha',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.bidang-usaha');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
