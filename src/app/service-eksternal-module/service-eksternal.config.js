(function() {
    'use strict';

    angular
        .module('service-eksternal-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/service-eksternal-module');

        $stateProvider
            .state('triangular.admin-default.service-eksternal', {
                url: '/service-eksternal',
                templateUrl: 'app/service-eksternal-module/service-eksternal-list.tmpl.html',
                // set the controller to load for this page
                controller: 'ServiceEksternalListController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.service-eksternal-add', {
                url: '/service-eksternal/add',
                templateUrl: 'app/service-eksternal-module/service-eksternal-add.tmpl.html',
                // set the controller to load for this page
                controller: 'ServiceEksternalAddController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.service-eksternal-edit', {
                url: '/service-eksternal/edit/:id',
                templateUrl: 'app/service-eksternal-module/service-eksternal-edit.tmpl.html',
                // set the controller to load for this page
                controller: 'ServiceEksternalEditController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.service-eksternal-view', {
                url: '/service-eksternal/view/:id',
                templateUrl: 'app/service-eksternal-module/service-eksternal-view.tmpl.html',
                // set the controller to load for this page
                controller: 'ServiceEksternalViewController',
                controllerAs: 'vm'
            });
    }
})();
