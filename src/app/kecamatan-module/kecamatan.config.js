(function() {
    'use strict';

    angular
        .module('kecamatan-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/kecamatan-module');

        $stateProvider
        .state('triangular.admin-default.kecamatan', {
            url: '/kecamatan',
            templateUrl: 'app/kecamatan-module/kecamatan-list.tmpl.html',
            controller: 'KecamatanListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kecamatan-add', {
            url: '/kecamatan/add',
            templateUrl: 'app/kecamatan-module/kecamatan-add.tmpl.html',
            controller: 'KecamatanAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kecamatan-edit', {
            url: '/kecamatan/edit/:id',
            templateUrl: 'app/kecamatan-module/kecamatan-edit.tmpl.html',
            controller: 'KecamatanEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kecamatan-view', {
            url: '/kecamatan/view/:id',
            templateUrl: 'app/kecamatan-module/kecamatan-view.tmpl.html',
            controller: 'KecamatanViewController',
            controllerAs: 'vm'
        });
    }
})();
