(function() {
    'use strict';

    angular
        .module('bidang-usaha-module')
        .controller('BidangUsahaEditController', BidangUsahaEditController);

    /* @ngInject */
    function BidangUsahaEditController($http, $state, $scope, EnvironmentConfig, $stateParams, AppFactory, BidangUsahaFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.bidang_usaha = {
            id: id,
            kode: '',
            keterangan: ''
        };

        BidangUsahaFactory.getBidangUsaha(id).then(function (res) {
            angular.copy(res.data.data, vm.bidang_usaha);
        });

        vm.updateAction = updateAction;
        vm.cancelAction = BidangUsahaFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'kode' : vm.bidang_usaha.kode,
                'keterangan' : vm.bidang_usaha.keterangan
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'bidang_usaha/' + id,
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
