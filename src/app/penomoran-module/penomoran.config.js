(function() {
    'use strict';

    angular
        .module('penomoran-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/penomoran-module');

        $stateProvider
        .state('triangular.admin-default.penomoran', {
            url: '/penomoran',
            templateUrl: 'app/penomoran-module/penomoran-list.tmpl.html',
            controller: 'PenomoranListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.penomoran-add', {
            url: '/penomoran/add',
            templateUrl: 'app/penomoran-module/penomoran-add.tmpl.html',
            controller: 'PenomoranAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.penomoran-edit', {
            url: '/penomoran/edit/:id',
            templateUrl: 'app/penomoran-module/penomoran-edit.tmpl.html',
            controller: 'PenomoranEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.penomoran-view', {
            url: '/penomoran/view/:id',
            templateUrl: 'app/penomoran-module/penomoran-view.tmpl.html',
            controller: 'PenomoranViewController',
            controllerAs: 'vm'
        });
    }
})();
