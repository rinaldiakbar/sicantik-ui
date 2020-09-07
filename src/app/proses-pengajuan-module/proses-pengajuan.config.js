(function() {
    'use strict';

    angular
        .module('proses-pengajuan-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/proses-pengajuan-module');

        $stateProvider
        .state('triangular.admin-default.proses-pengajuan', {
            url: '/proses-pengajuan',
            templateUrl: 'app/proses-pengajuan-module/proses-pengajuan-list.tmpl.html',
            // set the controller to load for this page
            controller: 'ProsesPengajuanList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.proses-pengajuan-view', {
            url: '/proses-pengajuan/view/:permohonan_id',
            templateUrl: 'app/proses-pengajuan-module/proses-pengajuan-view.tmpl.html',
            // set the controller to load for this page
            controller: 'ProsesPengajuanView',
            controllerAs: 'vm'
        })
    }
})();
