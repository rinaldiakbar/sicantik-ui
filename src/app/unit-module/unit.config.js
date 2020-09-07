(function() {
    'use strict';

    angular
        .module('unit-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/unit-module');

        $stateProvider
        .state('triangular.admin-default.unit', {
            url: '/unit',
            templateUrl: 'app/unit-module/unit-list.tmpl.html',
            // set the controller to load for this page
            controller: 'UnitListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.unit-structure', {
            url: '/unit/structure/:id',
            templateUrl: 'app/unit-module/unit-structure.tmpl.html',
            // set the controller to load for this page
            controller: 'UnitStructureController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.unit-add', {
            url: '/unit/add',
            templateUrl: 'app/unit-module/unit-add.tmpl.html',
            // set the controller to load for this page
            controller: 'UnitAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.unit-edit', {
            url: '/unit/edit/:id',
            templateUrl: 'app/unit-module/unit-edit.tmpl.html',
            // set the controller to load for this page
            controller: 'UnitEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.unit-view', {
            url: '/unit/view/:id',
            templateUrl: 'app/unit-module/unit-view.tmpl.html',
            // set the controller to load for this page
            controller: 'UnitViewController',
            controllerAs: 'vm'
        })
        ;
    }
})();
