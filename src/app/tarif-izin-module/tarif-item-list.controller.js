(function() {
    'use strict';

    angular
        .module('tarif-izin-module')
        .controller('TarifItemListController', TarifItemListController);

    /* @ngInject */
    function TarifItemListController(
        $http, $state, EnvironmentConfig, ElementConfig, $scope, $timeout, $q, $mdDialog, $stateParams, AppFactory, TarifIzinFactory
    ) {
        var vm = this;
        var jenisIzinId = $stateParams.jenis_izin_id;

        vm.jenis_izin = {};

        TarifIzinFactory.getJenisIzin(jenisIzinId).then(function(res) {
            angular.copy(res.data.data, vm.jenis_izin);
            if (!vm.jenis_izin.hasOwnProperty('formula_retribusi')) {
                vm.jenis_izin.formula_retribusi = {};
                vm.jenis_izin.formula_retribusi.formula = null;
            }
            activate();
        });

        vm.showFormAdd = function() {
            $state.go('triangular.admin-default.tarif-item-add', { 'jenis_izin_id': jenisIzinId });
        };

        vm.showFormEdit = function(id) {
            $state.go('triangular.admin-default.tarif-item-edit', { 'jenis_izin_id': jenisIzinId, 'id': id });
        };

        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.tarif-item-view', { 'jenis_izin_id': jenisIzinId, 'id': id });
        };

        vm.confirmDelete = function(id) {
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
            ).then(function() {
                TarifIzinFactory.deleteTarifItem(id).then(function() {
                    getData();
                });
            });
        };

        vm.saveAction = saveAction;
        vm.cancelAction = TarifIzinFactory.cancelAction;

        /*** BEGIN - Advance Table ***/
        vm.query = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-id',
            page: 1
        };
        vm.filter = {
            options: {
                debounce: 500
            }
        };
        vm.getData = getData;
        vm.removeFilter = removeFilter;

        ///////////
        function activate() {
            var bookmark;
            $scope.$watch('vm.query.filter', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.query.page;
                }

                if (!newValue) {
                    vm.query.page = bookmark;
                }

                if (newValue !== oldValue) {
                    vm.getData();
                }
            });
        }

        function getData() {
            vm.query.izin_id = jenisIzinId;
            TarifIzinFactory.getPagedTarifItem(vm.query).then(function(res) {
                vm.data = res.data.data;
            });
        }

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }
        /*** END - Advance Table ***/

        function saveAction() {
            var reqData = {
                'formula': vm.jenis_izin.formula_retribusi.formula,
                'jenis_izin_id': vm.jenis_izin.id
            };

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'FormulaRetribusi/save',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.tarif-izin');
                })
                .error(function(err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
