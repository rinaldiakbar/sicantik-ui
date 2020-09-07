(function() {
    'use strict';

    angular
        .module('admin-profile-module')
        .controller('AdminProfileController', AdminProfileController);

    /* @ngInject */
    function AdminProfileController($http, $state, EnvironmentConfig, AppFactory, AdminProfileFactory) {
        var vm = this;

        vm.user = {
            id: null,
            username: '',
            email: '',
            name: '',
            role_name: '',
            password: '',
            confirm: ''
        };

        AdminProfileFactory.getProfile().then(function (res) {
            var userData = res.data.data;
            vm.user.id = userData.id;
            vm.user.username = userData.username;
            vm.user.email = userData.email;
            if (userData.pegawai) {
                vm.user.name = userData.pegawai.nama;
            }
            vm.user.role_name = userData.peran.label_peran;
        });

        vm.changePasswordAction = changePasswordAction;

        function changePasswordAction() {
            var reqData = {'id' : vm.user.id, 'password' : vm.user.password};
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pengguna/changepassword',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
              .success(function(res){
                  AppFactory.showToast(res.message);
                  $state.reload();
              })
              .error(function(err){
                  AppFactory.showToast(err.message, 'error', err.errors);
              });
        }

    }
})();