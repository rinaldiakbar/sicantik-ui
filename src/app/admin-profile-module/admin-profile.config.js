(function() {
    'use strict';

    angular
        .module('admin-profile-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/admin-profile-module');

        $stateProvider
        .state('triangular.admin-default.admin-profile', {
            url: '/profile',
            templateUrl: 'app/admin-profile-module/admin-profile.tmpl.html',
            controller: 'AdminProfileController',
            controllerAs: 'vm'
        });
    }
})();
