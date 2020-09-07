(function() {
    'use strict';

    angular
        .module('inovasi-aduan-module')
        .controller('InovasiAduanListController', InovasiAduanListController);

    /* @ngInject */
    function InovasiAduanListController($http, $state, EnvironmentConfig, ElementConfig, $scope, $timeout, $q, $mdDialog, $mdToast, InovasiAduanFactory) {
        var vm = this;

        vm.showFormAdd = function() {
            $state.go('triangular.admin-default.inovasi-aduan-add');
        };

        vm.showFormEdit = function(id) {
            $state.go('triangular.admin-default.inovasi-aduan-edit', { 'id': id });
        };

        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.inovasi-aduan-view', { 'id': id });
        };

        vm.confirmOpen = function(id, data) {
            var dialog = {
                title: 'Apakah anda yakin untuk membuka kembali pengembangan yang ada?',
                content: 'Data yang sudah dibuka tidak dapat ditutup!',
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
                InovasiAduanFactory.openAduan(id, data).then(function() {
                    getData();
                });
            });
        };

        /*** BEGIN - Advance Table ***/
        vm.query = {
                filter: '',
                limit: ElementConfig.gridRow,
                order: '-CAduan.tgl_diubah',
                page: 1,
                status:'',
                kategori:''
            };
        vm.filter = {
            options: {
                debounce: 500
            }
        };
        vm.getData = getData;
        vm.removeFilter = removeFilter;
        vm.prev = prev;
        vm.next = next;
        getData();

        function getData() {
            InovasiAduanFactory.getAduanList(vm.query).then(function(res) {
                vm.data = res.data.data;
                var proces = vm.data.total_items / vm.data.limit;
                vm.nextmax = Math.round(proces);
            });
        }

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }

        function prev() {
            var min = 1;
            var result = vm.query.page - min;
 
            vm.query.page = result;
            getData();
        }

        function next() {
            var max = 1;
            var result = vm.query.page + max;

            vm.query.page = result;
            getData();
        }

        /*** BEGIN - Autocomplete for Kategori ***/
            vm.selectedItem = null;
            vm.searchText = null;
            vm.querySearch = InovasiAduanFactory.querySearchKategori;
            vm.isDisabled = false;
            vm.noCache = true;
            vm.selectedItemChange = selectedItemChange;

            function selectedItemChange(item) {
                if (angular.isDefined(item)) {
                    vm.query.kategori = item.path;
                } else {
                    vm.query.kategori = null;
                }
            }
        /*** END - Autocomplete for Kategori ***/

        /*** END - Advance Table ***/
    }
})();