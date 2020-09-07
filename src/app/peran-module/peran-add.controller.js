(function() {
    'use strict';

    angular
        .module('peran-module')
        .controller('PeranAddController', PeranAddController);

    /* @ngInject */
    function PeranAddController($http, $state, EnvironmentConfig, $log, AppFactory, PeranFactory, TreeFactory) {
        var vm = this;
        vm.peran = {
            label_peran: '',
            instansi_id: null,
            home_path: null
        };
        vm.treeData = [];

        PeranFactory.getAllMenu().then(function(res) {
            vm.treeData = TreeFactory.buildTreeData(res.data.data);
        });

        vm.createAction = createAction;
        vm.cancelAction = PeranFactory.cancelAction;

        function createAction() {
            var selectedMenuIds = TreeFactory.getSelectedNodeValues(vm.treeData);
            var reqData = {
                'label_peran': vm.peran.label_peran,
                'home_path': vm.peran.home_path,
                'instansi_id': vm.peran.instansi_id,
                'menu_ids': selectedMenuIds
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'peran',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.peran');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = PeranFactory.querySearchInstansi;
        vm.isDisabled = false;
        vm.noCache = false;
        vm.selectedItemChange = selectedItemChangeInstansi;

        function selectedItemChangeInstansi(item) {
            if (angular.isDefined(item)) {
                vm.peran.instansi_id = item.id;
            } else {
                vm.peran.instansi_id = null;
            }
        }
        /*** END - Autocomplete for Instansi ***/
    }
})();
