(function() {
    'use strict';

    angular
        .module('app.admin.authentication')
        .controller('LogoutController', LogoutController);

    /* @ngInject */
    function LogoutController($state, $auth, $rootScope, APP_CONFIG) {
        $auth.logout().then(function() {

            // Remove the authenticated user and menu from local storage
            localStorage.removeItem(APP_CONFIG.localStorageKey);
            localStorage.removeItem(APP_CONFIG.menuStorageKey);
            localStorage.removeItem('lastActive');

            // Flip authenticated to false so that we no longer
            // show UI elements dependant on the user being logged in
            $rootScope.authenticated = false;

            // Remove the current user info from rootscope
            $rootScope.currentUser = null;

            $state.go('authentication.login');
        });
    }
})();