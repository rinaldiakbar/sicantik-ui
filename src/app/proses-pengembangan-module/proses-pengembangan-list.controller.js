(function() {
    'use strict';

    angular
        .module('proses-pengembangan-module')
        .controller('ProsesPengembanganList', ProsesPengembanganList);

    /* @ngInject */
    function ProsesPengembanganList($http, $state, EnvironmentConfig, ElementConfig, $scope, $timeout, $q, $mdDialog, ProsesPengembanganFactory) {
        var vm = this;
        vm.showFormAdd = function() {
            $state.go('triangular.admin-default.proses-pengembangan-add');
        };
        vm.showFormEdit = function(id) {
            $state.go('triangular.admin-default.proses-pengembangan-edit', { 'id': id });
        };
        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.proses-pengembangan-view', { 'id': id });
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
            ).then(function(res) {
                ProsesPengembanganFactory.deleteAduan(id).then(function(res) {
                    getData();
                });
            });
        };

        /*** BEGIN - Advance Table ***/
        vm.query = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-id',
            page: 1,
            status:'',
            kategori:''
        };
        vm.filter = {
            options: {
                debounce: 500
            }
        };
        
        vm.removeFilter = removeFilter;
        vm.prev = prev;
        vm.next = next;
        vm.max = 0;
        vm.prevVal = true;
        vm.nextVal = true;
        vm.getData = getData;
        getData();

        function prev() {
            var min = 1;
            var result = vm.query.page - min;
            vm.query.page = result;
            if(result == 1){
                vm.prevVal = true;
            }else{
                vm.prevVal = false;
            }
            if(result !== vm.max){
                vm.nextVal = false;
            }else{
                vm.nextVal = true;
            }
            getData();
        }

        function next() {
            var max = 1;
            var result = vm.query.page + 1;
            vm.query.page = result;
            if(result == vm.max){
                vm.nextVal = true;
            }else{
                vm.nextVal = false;
            }
            if(result != 1){
                vm.prevVal = false;
            }else{
                vm.prevVal = true;
            }
            getData();
        }

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
            ProsesPengembanganFactory.getPagedProsesPengembangan(vm.query).then(function(res) {
                vm.data = res.data.data;
                vm.max = Math.floor(vm.data.total_items / vm.data.limit);
                if(vm.data.total_items > vm.data.limit){
                    vm.nextVal = false;
                }
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

        /*** BEGIN - Autocomplete for Kategori ***/
            vm.selectedItem = null;
            vm.searchText = null;
            vm.querySearch = ProsesPengembanganFactory.querySearchKategori;
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