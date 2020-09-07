(function() {
    'use strict';

    angular
        .module('rest-service-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/rest-service-module');

        $stateProvider
        .state('triangular.admin-default.rest-service', {
            url: '/rest-service',
            templateUrl: 'app/rest-service-module/rest-service-list.tmpl.html',
            controller: 'RestServiceListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.rest-service-add', {
            url: '/rest-service/add',
            templateUrl: 'app/rest-service-module/rest-service-add.tmpl.html',
            controller: 'RestServiceAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.rest-service-edit', {
            url: '/rest-service/edit/:id',
            templateUrl: 'app/rest-service-module/rest-service-edit.tmpl.html',
            controller: 'RestServiceEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.rest-service-view', {
            url: '/rest-service/view/:id',
            templateUrl: 'app/rest-service-module/rest-service-view.tmpl.html',
            controller: 'RestServiceViewController',
            controllerAs: 'vm'
        });
    }
})();
