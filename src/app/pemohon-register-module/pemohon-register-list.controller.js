(function() {
    'use strict';

    angular
        .module('pemohon-register-module')
        .controller('PemohonRegisterList', PemohonRegisterList);

    /* @ngInject */
    function PemohonRegisterList(
        $http, $state, $scope, $timeout, $q, $mdDialog, $log,
        EnvironmentConfig, ElementConfig,
        PemohonRegisterFactory
    ) {
        var vm = this;

        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.pemohon-register-view', { 'key_id': id });
        };

        vm.confirmApprove = function(id) {
            var dialog = {
                title: 'Approve registrasi pemohon ini?',
                content: 'Data akan masuk ke dalam daftar pemohon!',
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
                PemohonRegisterFactory.approvePemohonRegister(id).then(function(res) {
                    getData();
                });
            });
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
                PemohonRegisterFactory.deletePemohonRegister(id).then(function(res) {
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
            PemohonRegisterFactory.getPagedPemohonRegister(vm.query).then(function(res) {
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