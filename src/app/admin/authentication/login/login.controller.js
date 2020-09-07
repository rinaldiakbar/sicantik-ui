(function() {
    'use strict';

    angular
        .module('app.admin.authentication')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController(
        $state, $stateParams, triSettings, triMenu, $http, $mdToast, $auth, $rootScope, $log,
        EnvironmentConfig, MenuService, APP_CONFIG, $cookies, SsoFactory
    ) {
        var vm = this;
        vm.loginClick = loginClick;
        vm.showRegisterPemohon = EnvironmentConfig.showRegisterPemohon;
        vm.socialLogins = [{
            icon: 'fa fa-twitter',
            color: '#5bc0de',
            url: '#'
        }, {
            icon: 'fa fa-facebook',
            color: '#337ab7',
            url: '#'
        }, {
            icon: 'fa fa-google-plus',
            color: '#e05d6f',
            url: '#'
        }, {
            icon: 'fa fa-linkedin',
            color: '#337ab7',
            url: '#'
        }];
        vm.triSettings = triSettings;
        // create blank user variable for login form
        vm.user = {
            username: '',
            password: '',
            redirect: null,
            token: null
        };

        /*
        Auto login dari oss dengan validasi dari user_token dan kdizin
        membuka form sesuai kdizin yang ada
        */
        if ($stateParams.kdizin) {
            SsoFactory.autoLogin($stateParams.kdizin, $stateParams.username)
                .then(function(res) {
                    vm.user.username = res.data.data.username;
                    vm.user.token = res.data.data.token;
                    vm.user.redirect = res.data.data.redirect;
                    if(vm.user.token != null) {
                        $http.defaults.headers.common.Authorization = 'Bearer '+vm.user.token;
                        getProfile();
                    } else {
                        vm.user.password = null;
                        $mdToast.show({
                            template: '<md-toast><span flex> Masukkan password OSS anda</span></md-toast>',
                            position: 'top right',
                            hideDelay: 8000
                        });
                    }
                });
        }

        ////////////////

        function loginClick() {
            loginAction();
        }

        function loginAction() {
            var credentials = vm.user;

            $auth.login(credentials).then(function() {
                $rootScope.authenticated = true;
                triMenu.removeAllMenu();

                // TODO Get User Detail to be displayed during login
                // Return an $http request for the now authenticated
                // user so that we can flatten the promise chain
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'pengguna/profile',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                };

                return $http(req).success(function(res) {
                    $mdToast.show({
                        template: '<md-toast><span flex>' + 'Selamat Datang di Aplikasi ' + EnvironmentConfig.name + '</span></md-toast>',
                        position: 'top right',
                        hideDelay: 3000
                    });

                    $log.info('Login Success');

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

                    // Everything worked out so we can now redirect to the users home
                    if (res.data.peran.home_path) {
                        MenuService.openLink(res.data.peran.home_path);
                    } else {
                        $rootScope.$broadcast('routeChange');
                        $state.go('triangular.admin-default.home');
                    }

                });

                // Handle errors
            }, function() {
                //Begin link to oss login
                SsoFactory.initSso(vm.user)
                    .then(function (res) {
                        //TODO : Dihapus jika design sudah settle
                        /* if (res.status == 200) { // Jika bisa, diganti saja dengan `res.status !== 200`
                            return Promise.reject({
                                data: {
                                    message: 'Tidak dapat inisialisasi SSO'
                                }
                            });
                        } */
                        
                        if (res.status == 200) {
                            loginAction();
                        } else {
                            vm.loginError = true;
                            $mdToast.show({
                                template: '<md-toast><span flex>' + res.data.message + '</span></md-toast>',
                                position: 'top right',
                                hideDelay: 8000
                            });
                        }

                        //return SsoFactory.loginSso(vm.user, res.data.data);
                    })/* 
                    .then(function (res) {
                        if (res.status !== 200) {
                            return Promise.reject({
                                data: {
                                    message: res.data.responloginSSO.keterangan
                                }
                            });
                        }

                        var data = {
                            nama: res.data.fullname,
                            nip: res.data.nik,
                            instansi: res.data.instansi,
                            pengguna: [{
                                'username': vm.user.username,
                                'password': vm.user.password,
                                'email': res.data.email,
                                'peran_id': 2
                            }]
                        };

                        var req = {
                            method: 'POST',
                            url: EnvironmentConfig.api + 'pegawai',
                            headers: {
                                'Content-Type': 'application/json; charset=UTF-8'
                            },
                            data: data
                        };

                        return $http(req);
                    })
                    .then(function () {
                        $mdToast.show({
                            template: '<md-toast><span flex> Login dari OSS berhasil</span></md-toast>',
                            position: 'top right',
                            hideDelay: 8000
                        });
                    })
                    .catch(function (error) {
                        vm.loginError = true;
                        $mdToast.show({
                            template: '<md-toast><span flex>' + error.data.message + '</span></md-toast>',
                            position: 'top right',
                            hideDelay: 8000
                        });
                    }); */

                // Because we returned the $http.get request in the $auth.login
                // promise, we can chain the next promise to the end here
            });
        }
        
        function getProfile() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pengguna/profile',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };

            return $http(req).success(function (res) {
                $mdToast.show({
                    template: '<md-toast><span flex>' + 'Selamat Datang di Aplikasi ' + EnvironmentConfig.name + '</span></md-toast>',
                    position: 'top right',
                    hideDelay: 3000
                });

                $log.info('Login Success');

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

                // Everything worked out so we redirect to form/add/...
                if(vm.user.redirect != null) {
                    MenuService.openLink(vm.user.redirect);
                } else {
                    if (res.data.peran.home_path) {
                        MenuService.openLink(res.data.peran.home_path);
                    } else {
                        $rootScope.$broadcast('routeChange');
                        $state.go('triangular.admin-default.home');
                    }
                }

            });
        }
    }
})();