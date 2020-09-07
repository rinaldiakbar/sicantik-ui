(function() {
    'use strict';

    angular
        .module('aduan-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/aduan-module');

        $stateProvider
        .state('triangular.admin-default.aduan', {
            url: '/aduan',
            templateUrl: 'app/aduan-module/aduan-list.tmpl.html',
            // set the controller to load for this page
            controller: 'AduanList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.aduan-add', {
            url: '/aduan-add',
            templateUrl: 'app/aduan-module/aduan-add.tmpl.html',
            // set the controller to load for this page
            controller: 'AduanAdd',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.aduan-edit', {
            url: '/aduan-edit/:id',
            templateUrl: 'app/aduan-module/aduan-edit.tmpl.html',
            // set the controller to load for this page
            controller: 'AduanEdit',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.aduan-view', {
            url: '/aduan-view/:id',
            templateUrl: 'app/aduan-module/aduan-view.tmpl.html',
            // set the controller to load for this page
            controller: 'AduanView',
            controllerAs: 'vm'
        })
    }
})();
