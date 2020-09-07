(function() {
    'use strict';

    angular
        .module('peran-module')
        .controller('PeranEditController', PeranEditController);

    /* @ngInject */
    function PeranEditController($http, $state, EnvironmentConfig, $stateParams, AppFactory, PeranFactory, TreeFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.peran = {
            id: id,
            label_peran: '',
            instansi_id: null,
            home_path: null
        };
        vm.treeData = [];

        PeranFactory.getPeran(id).then(function(res) {
            angular.copy(res.data.data, vm.peran);
            vm.searchText = (res.data.data.instansi) ? res.data.data.instansi.nama : null;
            vm.treeData = TreeFactory.buildTreeData(res.data.data.all_menu);
        });

        vm.updateAction = updateAction;
        vm.cancelAction = PeranFactory.cancelAction;

        function updateAction() {
            var selectedMenuIds = TreeFactory.getSelectedNodeValues(vm.treeData);
            var reqData = {
                'label_peran': vm.peran.label_peran,
                'home_path': vm.peran.home_path,
                'instansi_id': vm.peran.instansi_id,
                'menu_ids': selectedMenuIds
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'peran/' + id,
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

        /*** BEGIN - Tree ***/
        /*
        vm.awesomeCallback = function(node, tree) {
            // Do something with node or tree
        };

        vm.otherAwesomeCallback = function(node, isSelected, tree) {
            // Do soemthing with node or tree based on isSelected
        };
        */
        /*** END - Tree ***/

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
