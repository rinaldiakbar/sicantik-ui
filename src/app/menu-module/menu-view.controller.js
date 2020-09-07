(function() {
    'use strict';

    angular
        .module('menu-module')
        .controller('MenuViewController', MenuViewController);

    /* @ngInject */
    function MenuViewController($http, $state, EnvironmentConfig, $stateParams, MenuFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.menu = {};

        MenuFactory.getMenu(id).then(function (res) {
           angular.copy(res.data.data, vm.menu);
        });

        vm.cancelAction = MenuFactory.cancelAction;
    }
})();
