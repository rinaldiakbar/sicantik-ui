(function () {
    'use strict';
    angular
        .module('admin-profile-module', [])
        .factory('AdminProfileFactory', AdminProfileFactory);

    function AdminProfileFactory($http, $rootScope, $log, APP_CONFIG, EnvironmentConfig) {
        return {
            getProfile: getProfile,
            getSetting: getSetting,
            getNotifications: getNotifications
        };

        /**
         * Get User Detail
         */
        function getProfile() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pengguna/profile',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };

            return $http(req).success(function (res) {
                // Stringify the returned data to prepare it
                // to go into local storage
                var user = angular.toJson(res.data);

                // Set the stringified user data into local storage
                localStorage.setItem(APP_CONFIG.localStorageKey, user);

                // The user's authenticated state gets flipped to
                // true so we can now show parts of the UI that rely
                // on the user being logged in
                $rootScope.authenticated = true;

                // Putting the user's data on $rootScope allows
                // us to access it anywhere across the app
                $rootScope.currentUser = user;
            });
        }


        /**
         * Get the default setting for the user if any
         */
        function getSetting() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pengguna/setting',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        /**
         * Get notifications for current user
         */
        function getNotifications(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pesan/notifikasi?q=' + query.filter +
                    '&page=' + query.page +
                    '&limit=' + query.limit +
                    '&grouped=' + query.grouped +
                    '&tipe=' + query.tipe,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }
    }
})();
