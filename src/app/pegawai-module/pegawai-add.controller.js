(function() {
    'use strict';

    angular
        .module('pegawai-module')
        .controller('PegawaiAddController', PegawaiAddController);

    /* @ngInject */
    function PegawaiAddController(
        $http, $state, EnvironmentConfig,
        AppFactory, PegawaiFactory, UnitFactory, JabatanFactory
    ) {
        var vm = this;
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

        vm.createAction = createAction;
        vm.cancelAction = PegawaiFactory.cancelAction;

        function createAction() {
            var reqData = vm.pegawai;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pegawai',
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
