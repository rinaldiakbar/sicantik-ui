(function() {
    'use strict';

    angular
        .module('peran-module')
        .controller('PeranViewController', PeranViewController);

    /* @ngInject */
    function PeranViewController($http, $state, $stateParams, PeranFactory, TreeFactory, ivhTreeviewOptions) {
        var vm = this;
        var id = $stateParams.id;
        vm.peran = {};
        vm.treeData = [];

        var treeOptions = ivhTreeviewOptions();
        treeOptions.useCheckboxes = true;

        PeranFactory.getPeran(id).then(function(res) {
            angular.copy(res.data.data, vm.peran);
            vm.treeData = TreeFactory.buildTreeData(res.data.data.all_menu);
        });

        vm.cancelAction = PeranFactory.cancelAction;
    }
})();
