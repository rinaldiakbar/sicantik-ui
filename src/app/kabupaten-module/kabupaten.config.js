(function() {
    'use strict';

    angular
        .module('kabupaten-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/kabupaten-module');

        $stateProvider
        .state('triangular.admin-default.kabupaten', {
            url: '/kabupaten',
            templateUrl: 'app/kabupaten-module/kabupaten-list.tmpl.html',
            controller: 'KabupatenListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kabupaten-add', {
            url: '/kabupaten/add',
            templateUrl: 'app/kabupaten-module/kabupaten-add.tmpl.html',
            controller: 'KabupatenAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kabupaten-edit', {
            url: '/kabupaten/edit/:id',
            templateUrl: 'app/kabupaten-module/kabupaten-edit.tmpl.html',
            controller: 'KabupatenEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kabupaten-view', {
            url: '/kabupaten/view/:id',
            templateUrl: 'app/kabupaten-module/kabupaten-view.tmpl.html',
            controller: 'KabupatenViewController',
            controllerAs: 'vm'
        });
    }
})();
