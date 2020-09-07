(function() {
    'use strict';

    angular
        .module('pemohon-register-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/pemohon-register-module');

        $stateProvider
        .state('triangular.admin-default.pemohon-register-list', {
            url: '/pemohon-register',
            templateUrl: 'app/pemohon-register-module/pemohon-register-list.tmpl.html',
            // set the controller to load for this page
            controller: 'PemohonRegisterList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.pemohon-register-view', {
            url: '/pemohon-register/view/:key_id',
            templateUrl: 'app/pemohon-register-module/pemohon-register-view.tmpl.html',
            // set the controller to load for this page
            controller: 'PemohonRegisterView',
            controllerAs: 'vm'
        });
    }
})();
