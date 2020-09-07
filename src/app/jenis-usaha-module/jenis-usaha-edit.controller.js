(function() {
    'use strict';

    angular
        .module('jenis-usaha-module')
        .controller('JenisUsahaEditController', JenisUsahaEditController);

    /* @ngInject */
    function JenisUsahaEditController(
        $http, $state, $scope, $mdToast, EnvironmentConfig, $stateParams, AppFactory, JenisUsahaFactory, $log
    ) {
        var vm = this;
        var id = $stateParams.id;
        vm.jenis_usaha = {
            id: id,
            kode: '',
            bidang_usaha_id: null
        };

        /*** BEGIN - Autocomplete for Kecamatan ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = JenisUsahaFactory.querySearchBidangUsaha;
        vm.simulateQuery = false;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChangeBidangUsaha;

        //////////////////
        function selectedItemChangeBidangUsaha(item) {
            if (angular.isDefined(item)) {
                $log.info('Item changed to ' + angular.toJson(item));
                vm.jenis_usaha.bidang_usaha_id = item.id;
            }
        }

        /*** END - Autocomplete for Kecamatan ***/

        JenisUsahaFactory.getJenisUsaha(id).then(function(res) {
            angular.copy(res.data.data, vm.jenis_usaha);
            vm.searchText = vm.jenis_usaha.bidang_usaha._lowername;
        });

        vm.updateAction = updateAction;
        vm.cancelAction = JenisUsahaFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'kode': vm.jenis_usaha.kode,
                'keterangan': vm.jenis_usaha.keterangan,
                'bidang_usaha_id': vm.jenis_usaha.bidang_usaha_id
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'jenis_usaha/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.jenis-usaha');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();