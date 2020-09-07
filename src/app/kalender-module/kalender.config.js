(function() {
    'use strict';

    angular
        .module('kalender-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/kalender-module');

        $stateProvider
        .state('triangular.admin-default.kalender', {
            url: '/kalender',
            templateUrl: 'app/kalender-module/kalender-list.tmpl.html',
            controller: 'KalenderListController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kalender-edit', {
            url: '/kalender/edit/:instansi_id',
            templateUrl: 'app/kalender-module/kalender-edit.tmpl.html',
            controller: 'KalenderEditController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.kalender-view', {
            url: '/kalender/view/:instansi_id',
            templateUrl: 'app/kalender-module/kalender-view.tmpl.html',
            controller: 'KalenderViewController',
            controllerAs: 'vm'
        })
        ;
    }
})();
