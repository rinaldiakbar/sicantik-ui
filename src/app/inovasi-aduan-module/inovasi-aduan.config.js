(function() {
    'use strict';

    angular
        .module('inovasi-aduan-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/inovasi-aduan-module');

        $stateProvider
        .state('triangular.admin-default.inovasi-aduan', {
            url: '/inovasi-aduan',
            templateUrl: 'app/inovasi-aduan-module/inovasi-aduan-list.tmpl.html',
            controller: 'InovasiAduanListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.inovasi-aduan-add', {
            url: '/inovasi-aduan-add',
            templateUrl: 'app/inovasi-aduan-module/inovasi-aduan-add.tmpl.html',
            controller: 'InovasiAduanAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.inovasi-aduan-edit', {
            url: '/inovasi-aduan-edit/:id',
            templateUrl: 'app/inovasi-aduan-module/inovasi-aduan-edit.tmpl.html',
            controller: 'InovasiAduanEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.inovasi-aduan-view', {
            url: '/inovasi-aduan-view/:id',
            templateUrl: 'app/inovasi-aduan-module/inovasi-aduan-view.tmpl.html',
            controller: 'InovasiAduanViewController',
            controllerAs: 'vm'
        });
    }
})();
