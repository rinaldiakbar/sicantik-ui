(function() {
    'use strict';

    angular
        .module('peran-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/peran-module');

        $stateProvider
        .state('triangular.admin-default.peran', {
            url: '/peran',
            templateUrl: 'app/peran-module/peran-list.tmpl.html',
            controller: 'PeranListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.peran-add', {
            url: '/peran/add',
            templateUrl: 'app/peran-module/peran-add.tmpl.html',
            controller: 'PeranAddController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.peran-edit', {
            url: '/peran/edit/:id',
            templateUrl: 'app/peran-module/peran-edit.tmpl.html',
            controller: 'PeranEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.peran-view', {
            url: '/peran/view/:id',
            templateUrl: 'app/peran-module/peran-view.tmpl.html',
            controller: 'PeranViewController',
            controllerAs: 'vm'
        })
        ;
    }
})();
