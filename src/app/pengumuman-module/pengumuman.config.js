(function() {
    'use strict';

    angular
        .module('pengumuman-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/pengumuman-module');

        $stateProvider
        .state('triangular.admin-default.pengumuman', {
            url: '/pengumuman',
            templateUrl: 'app/pengumuman-module/pengumuman-list.tmpl.html',
            controller: 'PengumumanListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengumuman-add', {
            url: '/pengumuman/add',
            templateUrl: 'app/pengumuman-module/pengumuman-add.tmpl.html',
            controller: 'PengumumanAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengumuman-edit', {
            url: '/pengumuman/edit/:id',
            templateUrl: 'app/pengumuman-module/pengumuman-edit.tmpl.html',
            controller: 'PengumumanEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pengumuman-view', {
            url: '/pengumuman/view/:id',
            templateUrl: 'app/pengumuman-module/pengumuman-view.tmpl.html',
            controller: 'PengumumanViewController',
            controllerAs: 'vm'
        });
    }
})();
