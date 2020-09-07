(function() {
    'use strict';

    angular
        .module('menu-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/menu-module');

        $stateProvider
        .state('triangular.admin-default.menu', {
            url: '/menu',
            templateUrl: 'app/menu-module/menu-list.tmpl.html',
            controller: 'MenuListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.menu-add', {
            url: '/menu/add',
            templateUrl: 'app/menu-module/menu-add.tmpl.html',
            controller: 'MenuAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.menu-edit', {
            url: '/menu/edit/:id',
            templateUrl: 'app/menu-module/menu-edit.tmpl.html',
            controller: 'MenuEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.menu-view', {
            url: '/menu/view/:id',
            templateUrl: 'app/menu-module/menu-view.tmpl.html',
            controller: 'MenuViewController',
            controllerAs: 'vm'
        });

        /*triMenuProvider.addMenu({
            name: 'Menu',
            icon: 'zmdi zmdi-grade',
            type: 'link',
            state: 'triangular.admin-default.menu',
            priority: 1.2
        });*/
    }
})();
