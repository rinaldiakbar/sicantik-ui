(function() {
    'use strict';

    angular
        .module('proses-pengembangan-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/proses-pengembangan-module');
        $stateProvider
        .state('triangular.admin-default.proses-pengembangan', {
            url: '/proses-pengembangan',
            templateUrl: 'app/proses-pengembangan-module/proses-pengembangan-list.tmpl.html',
            controller: 'ProsesPengembanganList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.proses-pengembangan-add', {
            url: '/proses-pengembangan/add',
            templateUrl: 'app/proses-pengembangan-module/proses-pengembangan-add.tmpl.html',
            controller: 'ProsesPengembanganAdd',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.proses-pengembangan-edit', {
            url: '/proses-pengembangan/edit/:id',
            templateUrl: 'app/proses-pengembangan-module/proses-pengembangan-edit.tmpl.html',
            controller: 'ProsesPengembanganEdit',
            controllerAs: 'vm'
        })
        $stateProvider
        .state('triangular.admin-default.proses-pengembangan-module', {
            url: '/proses-pengembangan/view/:id',
            templateUrl: 'app/proses-pengembangan-module/proses-pengembangan-view.tmpl.html',
            controller: 'ProsesPengembanganView',
            controllerAs: 'vm'
        })
    }
})();
