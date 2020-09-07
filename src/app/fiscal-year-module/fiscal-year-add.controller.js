(function () {
    'use strict';

    angular
        .module('fiscal-year-module')
        .controller('FiscalYearAdd', FiscalYearAdd);

    /* @ngInject */
    function FiscalYearAdd(
        $http, $state, EnvironmentConfig, $stateParams, $mdDialog, $mdMedia, $scope, $log,
        AppFactory, FiscalYearFactory, PerusahaanFactory) {
        var vm = this;

        /*** BEGIN - Main Form ***/
        vm.fiscal = {};
        vm.fiscal.c_ledger = [];

        vm.createAction = createAction;
        vm.cancelAction = FiscalYearFactory.cancelAction;

        function createAction() {
            var reqData = {
                'fiscal_year': vm.fiscal
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'cfiscalyear/add',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.fiscal-year');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** End - Main Form ***/

        /*** BEGIN - Tab Pegawai Atribut ***/
        vm.addNewLedger = function () {
            if (_.isNull(vm.fiscal.c_ledger)) {
                vm.fiscal = {};
                vm.fiscal.c_ledger = [];
            }
            if (vm.fiscal.c_ledger.length == 0) {
                vm.fiscal.c_ledger.push({
                    'item': null,
                    'nilai': null,
                    'currency': null,
                    'c_fiscal_year_id': null
                });
            }
        };

        vm.removeLedger = function (index) {
            if (angular.isDefined(vm.fiscal.c_ledger[index].id)) {
                var ledgerId = vm.fiscal.c_ledger[index].id;
                var dialog = {
                    title: 'Apakah anda yakin?',
                    content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                    ok: 'Ya',
                    cancel: 'Tidak'
                };

                $mdDialog.show(
                    $mdDialog.confirm()
                    .title(dialog.title)
                    .textContent(dialog.content)
                    .ok(dialog.ok)
                    .cancel(dialog.cancel)
                ).then(function (res) {
                    FiscalYearFactory.deleteLedger(ledgerId).then(function (res) {
                        vm.fiscal.c_ledger.splice(index, 1);
                    });
                });

            } else {
                vm.fiscal.c_ledger.splice(index, 1);
            }
        };

        /*** BEGIN - Autocomplete for Unit ***/
        vm.selectedItemPerusahaan = null;
        vm.searchTextPerusahaan = null;
        vm.querySearchPerusahaan = PerusahaanFactory.querySearchPerusahaan;
        vm.isDisabledPerusahaan = false;
        vm.noCachePerusahaan = true;
        vm.selectedItemChangePerusahaan = selectedItemChangePerusahaan;

        function selectedItemChangePerusahaan(item) {
            if (angular.isDefined(item)) {
                vm.fiscal.c_perusahaan_id = item.id;
            } else {
                vm.fiscal.c_perusahaan_id = null;
            }
        }
        /*** END - Autocomplete for Unit ***/
    }
})();