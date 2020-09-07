(function() {
    'use strict';
    
    angular
        .module('dashboard-module')
        .controller('DashboardListController', DashboardListController);

        /* @ngInject */
    function DashboardListController(EnvironmentConfig) {
            var vm = this;
            vm.showDashboardImage = EnvironmentConfig.showDashboardImage;
        }
})();
