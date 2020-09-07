(function () {
    'use strict';

    angular
        .module('kamus-data-module')
        .controller('DatatabelAddController', DatatabelAddController);

    /* @ngInject */
    function DatatabelAddController(
        $http, $state, EnvironmentConfig, $mdDialog, AppFactory, KamusDataFactory, tableobjectFilter
    ) {
        var vm = this;

        // Prevent  access from unauthorized user
        if (!AppFactory.isTopAdministrator()) {
            AppFactory.showToast('Anda tidak berhak mengakses halaman tersebut', 'warning');
            KamusDataFactory.cancelAction();
        }

        /*** BEGIN - Main Form ***/
        vm.datatabel = {
            nama_datatabel: '',
            label: '',
            visible: 1,
            is_custom: 1,
            is_view: 0,
            use_mapper: 0
        };
        vm.data_kolom = [];
        vm.unit_datatabel = [];

        KamusDataFactory.getTipeKolomList().then(function (res) {
            vm.tipeKolomList = res.data.data.items;
        });

        vm.namaDatatabelChange = namaDatatabelChange;
        vm.dataKolomChange = dataKolomChange;
        vm.createAction = createAction;
        vm.cancelAction = KamusDataFactory.cancelAction;

        function namaDatatabelChange() {
            vm.datatabel.nama_datatabel = tableobjectFilter(vm.datatabel.nama_datatabel);
        }

        function dataKolomChange(index) {
            vm.data_kolom[index].data_kolom = tableobjectFilter(vm.data_kolom[index].data_kolom);
        }

        function createAction() {
            var reqData = {
                'nama_datatabel': vm.datatabel.nama_datatabel,
                'label': vm.datatabel.label,
                'visible': vm.datatabel.visible,
                'is_custom': vm.datatabel.is_custom,
                'is_view': vm.datatabel.is_view,
                'use_mapper': vm.datatabel.use_mapper,
                'data_kolom': vm.data_kolom
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'datatabel',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.kamus-data');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
        /*** End - Main Form ***/

        /*** BEGIN - Tab Data Kolom ***/
        vm.addNewDataKolom = function () {
            vm.data_kolom.push({
                'data_kolom': '',
                'label': ''
            });
        };

        vm.removeDataKolom = function (index) {
            if (angular.isDefined(vm.data_kolom[index].id)) {
                var dataKolomId = vm.data_kolom[index].id;
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
                ).then(function () {
                    KamusDataFactory.deleteDataKolom(dataKolomId).then(function () {
                        vm.data_kolom.splice(index, 1);
                    });
                });
            } else {
                vm.data_kolom.splice(index, 1);
            }
        };
        /*** END - Data Kolom ***/

        /*** BEGIN - Unit Terkait ***/
        vm.addNewUnitDatatabel = function () {
            vm.unit_datatabel.push({
                    'unit_id': null
            });
        };

        vm.removeUnitDatatabel = function (index) {
            if (angular.isDefined(vm.unit_datatabel[index].id)) {
                var unitTerkaitId = vm.unit_datatabel[index].id;
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
                ).then(function () {
                    KamusDataFactory.deleteUnitDatatabel(unitTerkaitId).then(function () {
                        vm.unit_datatabel.splice(index, 1);
                        initUnitDatatabelAutocomplete();
                    });
                });

            } else {
                vm.unit_datatabel.splice(index, 1);
                initUnitDatatabelAutocomplete();
            }
        };

        vm.searchTextUnitDatatabel = [];
        vm.querySearchUnitDatatabel = KamusDataFactory.querySearchUnit;
        vm.selectedItemChangeUnitDatatabel = selectedItemChangeUnitDatatabel;

        function selectedItemChangeUnitDatatabel(item, index) {
            if (angular.isDefined(item)) {
                vm.unit_datatabel[index].unit_id = item.id;
            }
        }

        function initUnitDatatabelAutocomplete() {
            vm.unit_datatabel.forEach(function (unit_datatabel, index) {
                if (angular.isDefined(unit_datatabel.unit)) {
                    vm.searchTextUnitDatatabel[index] = unit_datatabel.unit.nama;
                }
            });
        }
        /*** END - Unit Terkait ***/
    }
})();
