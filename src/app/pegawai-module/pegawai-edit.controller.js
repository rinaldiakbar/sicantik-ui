(function() {
    'use strict';

    angular
        .module('pegawai-module')
        .controller('PegawaiEditController', PegawaiEditController);

    /* @ngInject */
    function PegawaiEditController(
        $http, $state, EnvironmentConfig, $stateParams,
        AppFactory, PegawaiFactory, UnitFactory, JabatanFactory
    ) {
        var vm = this;
        var id = $stateParams.id;
        vm.pegawai = {
            nama: null,
            nomor_induk: null,
            unit_id: null,
            posisi: null,
            jabatan_id: null,
            no_hp: null,
            email: null,
            instansi_id: null
        };

        PegawaiFactory.getPegawai(id).then(function (res){
            angular.copy(res.data.data, vm.pegawai);
            if (res.data.data.instansi) {
                vm.searchTextInstansi = res.data.data.instansi.nama;
            }
            if (res.data.data.unit) {
                vm.searchTextUnit = res.data.data.unit.nama;
            }
            if (res.data.data.jabatan) {
                vm.searchTextJabatan = res.data.data.jabatan.jabatan;
            }
        });

        vm.updateAction = updateAction;
        vm.cancelAction = PegawaiFactory.cancelAction;

        function updateAction() {
            var reqData = {
                'nama': vm.pegawai.nama,
                'nomor_induk': vm.pegawai.nomor_induk,
                'unit_id': vm.pegawai.unit_id,
                'posisi': vm.pegawai.posisi,
                'jabatan_id': vm.pegawai.jabatan_id,
                'no_hp': vm.pegawai.no_hp,
                'email': vm.pegawai.email,
                'instansi_id': vm.pegawai.instansi_id
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'pegawai/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.pegawai');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItemInstansi       = null;
        vm.searchTextInstansi         = null;
        vm.querySearchInstansi        = UnitFactory.querySearchInstansi;
        vm.isDisabledInstansi         = false;
        vm.noCacheInstansi            = true;
        vm.selectedItemChangeInstansi = selectedItemChangeInstansi;

        function selectedItemChangeInstansi(item) {
            if (angular.isDefined(item)) {
                vm.pegawai.instansi_id = item.id;
            } else {
                vm.pegawai.instansi_id = null;
            }
        }
        /*** END - Autocomplete for Instansi ***/

        /*** BEGIN - Autocomplete for Unit ***/
        vm.selectedItemUnit       = null;
        vm.searchTextUnit         = null;
        vm.querySearchUnit        = UnitFactory.querySearchUnit;
        vm.isDisabledUnit         = false;
        vm.noCacheUnit            = true;
        vm.selectedItemChangeUnit = selectedItemChangeUnit;

        function selectedItemChangeUnit(item) {
            if (angular.isDefined(item)) {
                vm.pegawai.unit_id = item.id;
            } else {
                vm.pegawai.unit_id = null;
            }
        }
        /*** END - Autocomplete for Unit ***/

        /*** BEGIN - Autocomplete for Jabatan ***/
        vm.selectedItemJabatan       = null;
        vm.searchTextJabatan         = null;
        vm.querySearchJabatan        = JabatanFactory.querySearchJabatan;
        vm.isDisabledJabatan         = false;
        vm.noCacheJabatan            = true;
        vm.selectedItemChangeJabatan = selectedItemChangeJabatan;

        function selectedItemChangeJabatan(item) {
            if (angular.isDefined(item)) {
                vm.pegawai.jabatan_id = item.id;
            } else {
                vm.pegawai.jabatan_id = null;
            }
        }
        /*** END - Autocomplete for Jabatan ***/
    }
})();
