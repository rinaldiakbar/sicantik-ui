(function() {
    'use strict';

    angular
        .module('bidang-usaha-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/bidang-usaha-module');

        $stateProvider
        .state('triangular.admin-default.bidang-usaha', {
            url: '/bidang-usaha',
            templateUrl: 'app/bidang-usaha-module/bidang-usaha-list.tmpl.html',
            controller: 'BidangUsahaListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.bidang-usaha-add', {
            url: '/bidang-usaha/add',
            templateUrl: 'app/bidang-usaha-module/bidang-usaha-add.tmpl.html',
            controller: 'BidangUsahaAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.bidang-usaha-edit', {
            url: '/bidang-usaha/edit/:id',
            templateUrl: 'app/bidang-usaha-module/bidang-usaha-edit.tmpl.html',
            controller: 'BidangUsahaEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.bidang-usaha-view', {
            url: '/bidang-usaha/view/:id',
            templateUrl: 'app/bidang-usaha-module/bidang-usaha-view.tmpl.html',
            controller: 'BidangUsahaViewController',
            controllerAs: 'vm'
        })
        ;
    }
})();
