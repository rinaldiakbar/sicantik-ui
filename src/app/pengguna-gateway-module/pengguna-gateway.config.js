(function() {
    'use strict';

    angular
        .module('pengguna-gateway-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/pengguna-gateway-module');

        $stateProvider
        .state('triangular.admin-default.pengguna-gateway', {
            url: '/pengguna-gateway',
            templateUrl: 'app/pengguna-gateway-module/pengguna-gateway-list.tmpl.html',
            controller: 'PenggunaGatewayListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengguna-gateway-add', {
            url: '/pengguna-gateway/add',
            templateUrl: 'app/pengguna-gateway-module/pengguna-gateway-add.tmpl.html',
            controller: 'PenggunaGatewayAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengguna-gateway-edit', {
            url: '/pengguna-gateway/edit/:id',
            templateUrl: 'app/pengguna-gateway-module/pengguna-gateway-edit.tmpl.html',
            controller: 'PenggunaGatewayEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengguna-gateway-view', {
            url: '/pengguna-gateway/view/:id',
            templateUrl: 'app/pengguna-gateway-module/pengguna-gateway-view.tmpl.html',
            controller: 'PenggunaGatewayViewController',
            controllerAs: 'vm'
        });
    }
})();
