(function() {
    'use strict';

    angular
        .module('tarif-izin-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/tarif-izin-module');

        $stateProvider
        .state('triangular.admin-default.tarif-izin', {
            url: '/tarif-izin',
            templateUrl: 'app/tarif-izin-module/tarif-izin-list.tmpl.html',
            controller: 'TarifIzinListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.tarif-item', {
            url: '/tarif-item/:jenis_izin_id',
            templateUrl: 'app/tarif-izin-module/tarif-item-list.tmpl.html',
            controller: 'TarifItemListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.tarif-item-add', {
            url: '/tarif-item/add/:jenis_izin_id',
            templateUrl: 'app/tarif-izin-module/tarif-item-add.tmpl.html',
            controller: 'TarifItemAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.tarif-item-edit', {
            url: '/tarif-item/edit/:jenis_izin_id/:id',
            templateUrl: 'app/tarif-izin-module/tarif-item-edit.tmpl.html',
            controller: 'TarifItemEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.tarif-item-view', {
            url: '/tarif-item/view/:jenis_izin_id/:id',
            templateUrl: 'app/tarif-izin-module/tarif-item-view.tmpl.html',
            controller: 'TarifItemViewController',
            controllerAs: 'vm'
        })
        ;
    }
})();
