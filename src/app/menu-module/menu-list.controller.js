(function() {
    'use strict';

    angular
        .module('menu-module')
        .controller('MenuListController', MenuListController);

    /* @ngInject */
    function MenuListController($state, $mdDialog, $scope, MenuFactory, TreeFactory) {
        var vm = this;

        vm.showFormAdd = function() {
            $state.go('triangular.admin-default.menu-add');
        };

        function getData() {
            MenuFactory.getHierarchicalMenu().then(function(res){
                vm.treeData = TreeFactory.buildTreeData(res.data.data.hierarchy);
            });
        }
        vm.getData = getData;
        
        getData();
    }
})();
