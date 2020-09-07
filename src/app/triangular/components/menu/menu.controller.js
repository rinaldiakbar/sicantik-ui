(function() {
    'use strict';

    angular
        .module('triangular.components')
        .controller('MenuController', MenuController);

    /* @ngInject */
    function MenuController(triSettings, triLayout, AdminProfileFactory, _) {
        var vm = this;
        vm.layout = triLayout.layout;

        vm.sidebarInfo = {
            appName: triSettings.name,
            appLogo: triSettings.logo
        };
        vm.toggleIconMenu = toggleIconMenu;

        AdminProfileFactory.getSetting().then(function (res) {
            if (!_.isNull(res.data.data.default_logo)) {
                vm.sidebarInfo.appLogo = res.data.data.default_logo;
            }
        });

        ////////////
        function toggleIconMenu() {
            var menu = vm.layout.sideMenuSize === 'icon' ? 'full' : 'icon';
            triLayout.setOption('sideMenuSize', menu);
        }
    }
})();
