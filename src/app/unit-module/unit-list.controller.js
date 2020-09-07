(function() {
    'use strict';

    angular
        .module('unit-module')
        .controller('UnitListController', UnitListController);

    /* @ngInject */
    function UnitListController($state, $mdDialog, $scope, AppFactory, UnitFactory, TreeFactory) {
        var vm = this;

        vm.showFormAdd = function() {
            $state.go('triangular.admin-default.unit-add');
        };

        function getData() {
            UnitFactory.getHierarchicalUnit().then(function(res) {
                vm.treeData = TreeFactory.buildTreeData(res.data.data.hierarchy);
            }, function(err) {
                if (err.message) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                }
            });
        }
        vm.getData = getData;

        getData();
    }
})();