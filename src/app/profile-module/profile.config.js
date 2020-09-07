(function() {
    'use strict';

    angular
        .module('profile-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/profile-module');

        $stateProvider
        .state('triangular.admin-default.profile-personal', {
            url: '/profile/profile-personal',
            templateUrl: 'app/profile-module/profile-list.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfileList',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-personal-add', {
            url: '/profile/profile-personal-add',
            templateUrl: 'app/profile-module/profile-add.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfileAdd',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-personal-edit', {
            url: '/profile/profile-personal-edit/:id',
            templateUrl: 'app/profile-module/profile-edit.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfileEdit',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.profile-personal-view', {
            url: '/profile/profile-personal-view/:id',
            templateUrl: 'app/profile-module/profile-view.tmpl.html',
            // set the controller to load for this page
            controller: 'ProfileView',
            controllerAs: 'vm'
        });
    }
})();
