(function () {
    'use strict';

    angular
        .module('menu-module')
        .controller('MenuEditController', MenuEditController);

    /* @ngInject */
    function MenuEditController(
        $http, $state, $stateParams, $scope, $log, $mdDialog, $mdMedia, $document, AppFactory, MenuFactory,
        EnvironmentConfig, _
    ) {
        var vm = this;
        var id = $stateParams.id;
        vm.menu = {
            label_menu: '',
            tautan: '',
            parent_id: 0,
            no_urut: 100,
            icon: null
        };
        vm.menu.menu_module = [];

        MenuFactory.getMenu(id).then(function (res) {
            angular.copy(res.data.data, vm.menu);
            if (!_.isNull(res.data.data.parent_menu)) {
                vm.searchText = res.data.data.parent_menu.label_menu;
            }
        });

        vm.updateAction = updateAction;
        vm.cancelAction = MenuFactory.cancelAction;
        vm.deleteAction = deleteAction;
        vm.showIconList = showIconList;

        function updateAction() {
            var reqData = {
                'label_menu': vm.menu.label_menu,
                'tautan': vm.menu.tautan,
                'parent_id': vm.menu.parent_id,
                'no_urut': vm.menu.no_urut,
                'icon': vm.menu.icon,
                'menu_module': vm.menu.menu_module
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'menu/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.menu');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function deleteAction() {
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
                MenuFactory.deleteMenu(id).then(function () {
                    $state.go('triangular.admin-default.menu');
                });
            });
        }

        /*** BEGIN - Autocomplete for Parent Menu ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = MenuFactory.querySearchMenu;
        vm.simulateQuery = false;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChangeMenu;

        //////////////////
        function selectedItemChangeMenu(item) {
            if (angular.isDefined(item)) {
                $log.info('Item changed to ' + item);
                vm.menu.parent_id = item.id;
            } else {
                vm.menu.parent_id = null;
            }
        }
        /*** END - Autocomplete for Parent Menu ***/

        function showIconList() {
            $mdDialog.show({
                    controller: IconDialogController,
                    templateUrl: 'app/menu-module/icon-list-dialog.tmpl.html',
                parent: angular.element($document.body),
                    clickOutsideToClose: true,
                    fullscreen: true
                })
                .then(function (formData) {
                    vm.menu.icon = formData.iconClass;
                }, function () {
                });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }


        /*** BEGIN - Tab Menu Module ***/
        vm.addNewDetail = function () {
            $log.info(vm.menu);
            vm.menu.menu_module.push({
                'tautan': ''
            });
        };

        vm.removeDetail = function (index) {
            if (angular.isDefined(vm.menu.menu_module[index].id)) {
                var detailId = vm.menu.menu_module[index].id;
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
                    MenuFactory.deleteDetail(detailId).then(function () {
                        vm.menu.menu_module.splice(index, 1);
                    });
                });
            } else {
                vm.menu.menu_module.splice(index, 1);
            }
        };
        /*** END - Tab Menu Module ***/
    }
})();