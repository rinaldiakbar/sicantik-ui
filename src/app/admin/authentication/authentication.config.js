(function() {
    'use strict';

    angular
        .module('app.admin.authentication')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/admin/authentication');

        $stateProvider
        .state('authentication', {
            abstract: true,
            templateUrl: 'app/admin/authentication/layouts/authentication.tmpl.html'
        })
        .state('authentication.login', {
            url: '/login',
            templateUrl: 'app/admin/authentication/login/login.tmpl.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .state('authentication.loginoss', {
            url: '/login/:username/:kdizin',
            templateUrl: 'app/admin/authentication/login/login.tmpl.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .state('authentication.logout', {
            url: '/logout',
            controller: 'LogoutController',
            controllerAs: 'vm'
        })
        .state('authentication.register', {
            url: '/register',
            templateUrl: 'app/admin/authentication/register/register.tmpl.html',
            controller: 'RegisterController',
            controllerAs: 'vm'
        })
        .state('authentication.forgot', {
            url: '/forgot',
            templateUrl: 'app/admin/authentication/forgot/forgot.tmpl.html',
            controller: 'ForgotController',
            controllerAs: 'vm'
        })
        .state('authentication.reset', {
            url: '/reset/:token',
            templateUrl: 'app/admin/authentication/forgot/reset.tmpl.html',
            controller: 'ResetController',
            controllerAs: 'vm'
        })
        .state('authentication.verify', {
            url: '/verify/:token',
            templateUrl: 'app/admin/authentication/register/verify.tmpl.html',
            controller: 'VerifyController',
            controllerAs: 'vm'
        });
    }
})();
