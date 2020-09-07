(function() {
    'use strict';

    angular
        .module('app')
        .config(authConfig);

    /* @ngInject */
    function authConfig($authProvider, EnvironmentConfig) {

        $authProvider.tokenName = 'data';
        $authProvider.baseUrl = EnvironmentConfig.api;
        $authProvider.loginUrl = '/pengguna/token';
    }
})();