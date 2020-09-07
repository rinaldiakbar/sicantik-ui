(function() {
    'use strict';

    angular
        .module('kamus-data-module')
        .controller('DatatabelListController', DatatabelListController);

    /* @ngInject */
    function DatatabelListController($state, $scope, $mdDialog, KamusDataFactory, ElementConfig, AppFactory) {
        var vm = this;
        vm.showAddButton = AppFactory.isTopAdministrator();
        vm.showEditButton = AppFactory.isTopAdministrator();

        vm.showFormAdd = function() {
            $state.go('triangular.admin-default.kamus-data-add');
        };

        vm.showFormEdit = function(id) {
            $state.go('triangular.admin-default.kamus-data-edit', { 'id': id });
        };

        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.kamus-data-view', { 'id': id });
        };

        vm.showRecords = function(id) {
            $state.go('triangular.admin-default.kamus-data-records', { 'id': id });
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
                KamusDataFactory.deleteDatatabel(id).then(function() {
                    getData();
                });
            });
        };

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
        activate();

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
            KamusDataFactory.getPagedDatatabel(vm.query).then(function(res) {
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
    }
})();