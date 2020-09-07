(function () {
    'use strict';

    angular
        .module('perusahaan-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/perusahaan-module');

        $stateProvider
            .state('triangular.admin-default.perusahaan', {
                url: '/perusahaan',
                templateUrl: 'app/perusahaan-module/perusahaan-list.tmpl.html',
                controller: 'PerusahaanListController',
                controllerAs: 'vm'
            })
            /*
            .state('triangular.admin-default.perusahaan-structure', {
                url: '/perusahaan/structure',
                templateUrl: 'app/perusahaan-module/perusahaan-structure.tmpl.html',
                controller: 'PerusahaanStructureController',
                controllerAs: 'vm'
            })
            */
            .state('triangular.admin-default.perusahaan-newstructure', {
                url: '/perusahaan/newstructure',
                templateUrl: 'app/perusahaan-module/perusahaan-newstructure.tmpl.html',
                controller: 'PerusahaanNewStructureController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.perusahaan-add', {
                url: '/perusahaan/add',
                templateUrl: 'app/perusahaan-module/perusahaan-add.tmpl.html',
                controller: 'PerusahaanAddController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.perusahaan-edit', {
                url: '/perusahaan/edit/:id',
                templateUrl: 'app/perusahaan-module/perusahaan-edit.tmpl.html',
                controller: 'PerusahaanEditController',
                controllerAs: 'vm'
            })
            .state('triangular.admin-default.perusahaan-view', {
                url: '/perusahaan/view/:id',
                templateUrl: 'app/perusahaan-module/perusahaan-view.tmpl.html',
                controller: 'PerusahaanViewController',
                controllerAs: 'vm'
            });
    }
})();
