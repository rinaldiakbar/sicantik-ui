(function () {
    'use strict';

    angular
        .module('dashboard-setting-module')
        .controller('DashboardSettingViewController', DashboardSettingViewController);

    /* @ngInject */
    function DashboardSettingViewController($stateParams, DashboardSettingFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.page = {};

        DashboardSettingFactory.getDashboardSetting(id).then(function (res) {
            angular.copy(res.data.data, vm.page);
        });

        vm.cancelAction = DashboardSettingFactory.cancelAction;
    }
})();
