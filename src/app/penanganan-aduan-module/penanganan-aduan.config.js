(function() {
    'use strict';

    angular
        .module('penanganan-aduan-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/penanganan-aduan-module');
        $stateProvider
        .state('triangular.admin-default.penanganan-aduan', {
            url: '/penanganan-aduan',
            templateUrl: 'app/penanganan-aduan-module/penanganan-aduan-list.tmpl.html',
            controller: 'PenangananAduanList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.penanganan-aduan-add', {
            url: '/penanganan-aduan/add',
            templateUrl: 'app/penanganan-aduan-module/penanganan-aduan-add.tmpl.html',
            controller: 'PenangananAduanAdd',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.penanganan-aduan-edit', {
            url: '/penanganan-aduan/edit/:id',
            templateUrl: 'app/penanganan-aduan-module/penanganan-aduan-edit.tmpl.html',
            controller: 'PenangananAduanEdit',
            controllerAs: 'vm'
        })
        $stateProvider
        .state('triangular.admin-default.penanganan-aduan-module', {
            url: '/penanganan-aduan/view/:id',
            templateUrl: 'app/penanganan-aduan-module/penanganan-aduan-view.tmpl.html',
            controller: 'PenangananAduanView',
            controllerAs: 'vm'
        })
    }
})();
