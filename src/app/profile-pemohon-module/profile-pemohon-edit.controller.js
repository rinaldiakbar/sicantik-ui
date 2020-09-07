(function() {
    'use strict';

    angular
        .module('profile-pemohon-module')
        .controller('ProfilePemohonEdit', ProfilePemohonEdit);

    /* @ngInject */
    function ProfilePemohonEdit(
        $state, $stateParams, $http, $log,
        APP_CONFIG, EnvironmentConfig, AppFactory, ProfilePemohonFactory, PermohonanIzinFactory, usernameFilter
    ) {
        var vm = this;

        vm.key_id = $stateParams.key_id;
        vm.pemohon = {};
        vm.genderList = [];
        vm.jenisIdentitasList = [];
        vm.showPenggunaForm = false;
        vm.maxBirthDate = AppFactory.getMaxBirthDate();

        vm.cancelAction = ProfilePemohonFactory.cancelAction;
        vm.updateAction = updateAction;
        vm.querySearchDesa = PermohonanIzinFactory.querySearchDesa;
        vm.selectedItemChangeDesa = selectedItemChangeDesa;
        vm.querySearchKecamatan = PermohonanIzinFactory.querySearchKecamatan;
        vm.selectedItemChangeKecamatan = selectedItemChangeKecamatan;
        vm.querySearchKabupaten = PermohonanIzinFactory.querySearchKabupaten;
        vm.selectedItemChangeKabupaten = selectedItemChangeKabupaten;
        vm.querySearchProvinsi = PermohonanIzinFactory.querySearchProvinsi;
        vm.selectedItemChangeProvinsi = selectedItemChangeProvinsi;
        vm.usernameChange = usernameChange;

        ProfilePemohonFactory.getProfilePemohon(vm.key_id).then(function (res) {
            res.data.data.tgl_lahir = moment(res.data.data.tgl_lahir, APP_CONFIG.datepickerFormat).toDate();
            angular.copy(res.data.data, vm.pemohon);

            vm.searchTextDesa = vm.pemohon.desa.nama_daerah;
            vm.searchTextKecamatan = vm.pemohon.kecamatan.nama_daerah;
            vm.searchTextKabupaten = vm.pemohon.kabupaten.nama_daerah;
            vm.searchTextProvinsi = vm.pemohon.provinsi.nama_daerah;

            if (vm.pemohon.pengguna) {
                vm.showPenggunaForm = true;
            }

            PermohonanIzinFactory.getGenderList().then(function (res) {
                vm.genderList = res.data.data.items;

                PermohonanIzinFactory.getJenisIdentitasList().then(function (res) {
                    vm.jenisIdentitasList = res.data.data.items;
                });
            });
        });

        /////////////////
        function updateAction() {
            var reqData = AppFactory.clone(vm.pemohon);
            // Format date before posting
            if (reqData.tgl_lahir instanceof Date) {
                reqData.tgl_lahir = moment(reqData.tgl_lahir).format(APP_CONFIG.datepickerFormat);
            }

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'pemohon/' + vm.key_id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    // $state.go('triangular.admin-default.permohonan-izin');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function selectedItemChangeProvinsi(item) {
            if (angular.isDefined(item)) {
                vm.pemohon.provinsi_id = item.id;
                vm.searchTextProvinsi = item.nama_daerah;
            } else {
                vm.pemohon.provinsi_id = null;
                vm.searchTextProvinsi = null;
            }
        }

        function selectedItemChangeKabupaten(item) {
            if (angular.isDefined(item)) {
                vm.pemohon.kabupaten_id = item.id;
                vm.searchTextKabupaten = item.nama_daerah;
            } else {
                vm.pemohon.kabupaten_id = null;
                vm.searchTextKabupaten = null;
            }
        }

        function selectedItemChangeKecamatan(item) {
            if (angular.isDefined(item)) {
                vm.pemohon.kecamatan_id = item.id;
                vm.searchTextKecamatan = item.nama_daerah;
            } else {
                vm.pemohon.kecamatan_id = null;
                vm.searchTextKecamatan = null;
            }
        }

        function selectedItemChangeDesa(item) {
            if (angular.isDefined(item)) {
                vm.pemohon.desa_id = item.id;
                vm.searchTextDesa = item.nama_daerah;
            } else {
                vm.pemohon.desa_id = null;
                vm.searchTextDesa = null;
            }
        }

        function usernameChange() {
            vm.pemohon.pengguna.username = usernameFilter(vm.pemohon.pengguna.username);
        }
    }
})();