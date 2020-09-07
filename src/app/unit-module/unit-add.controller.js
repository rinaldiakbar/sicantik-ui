(function() {
    'use strict';

    angular
        .module('unit-module')
        .controller('UnitAddController', UnitAddController);

    /* @ngInject */
    function UnitAddController($http, $state, EnvironmentConfig, $log, AppFactory, UnitFactory) {
        var vm = this;
        vm.unit = {
            nama: '',
            tipe: '',
            kode_daerah: '',
            parent_id: null,
            ws_url: null,
            instansi_code: null
        };
        vm.unit.parent_id_enabled = true;
        vm.searchTextKodeDaerah = '';
        vm.searchTextUnit = '';

        UnitFactory.getTipeListService().then(function(res) {
            vm.optionTipe = res.data.data.items;
        });

        vm.createAction = createAction;
        vm.cancelAction = UnitFactory.cancelAction;
        vm.tipeChanged = tipeChanged;

        function createAction() {
            var reqData = vm.unit;
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'unit',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.unit');
                })
                .error(function(err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function tipeChanged() {
            switch (vm.unit.tipe) {
                case 'I':
                    // disable Parent Unit
                    vm.unit.parent_id_enabled = false;
                    vm.unit.parent_id = null;
                    break;
                default:
                    vm.unit.parent_id_enabled = true;
                    break;
            }
        }

        /*** BEGIN - Autocomplete for Kode Daerah ***/
        vm.selectedItemKodeDaerah = null;
        vm.querySearchKodeDaerah = UnitFactory.querySearchKodeDaerah;
        vm.selectedItemChangeKodeDaerah = selectedItemChangeKodeDaerah;

        //////////////////
        function selectedItemChangeKodeDaerah(item) {
            if (angular.isDefined(item)) {
                vm.unit.kode_daerah = item.kode_daerah;
                $log.info('Kode Daerah changed to ' + item);
            }
        }
        /*** END - Autocomplete for Parent Kode Daerah ***/

        /*** BEGIN - Autocomplete for Unit ***/
        vm.selectedItemUnit = null;
        vm.querySearchStruktur = UnitFactory.querySearchStruktur;
        vm.selectedItemChangeUnit = selectedItemChangeUnit;

        //////////////////
        function selectedItemChangeUnit(item) {
            if (angular.isDefined(item)) {
                $log.info('Unit changed to ' + item);
                vm.unit.parent_id = item.id;
            }
        }
        /*** END - Autocomplete for Parent Unit ***/
    }
})();