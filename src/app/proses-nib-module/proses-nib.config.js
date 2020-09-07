(function() {
    'use strict';

    angular
        .module('proses-nib-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/proses-nib-module');

        $stateProvider
        .state('triangular.admin-default.proses-pengajuan-nib', {
            url: '/proses-pengajuan/nib/:nib_id',
            templateUrl: 'app/proses-nib-module/proses-nib-view.tmpl.html',
            // set the controller to load for this page
            controller: 'ProsesNibView',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.proses-nib', {
            url: '/proses-nib',
            templateUrl: 'app/proses-nib-module/proses-nib-list.tmpl.html',
            // set the controller to load for this page
            controller: 'ProsesNibList',
            controllerAs: 'vm'
        });
    }
})();
