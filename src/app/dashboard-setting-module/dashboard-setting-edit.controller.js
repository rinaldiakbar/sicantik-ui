(function () {
    'use strict';

    angular
        .module('dashboard-setting-module')
        .controller('DashboardSettingEditController', DashboardSettingEditController);

    /* @ngInject */
    function DashboardSettingEditController(
        $http, $state, $mdDialog, $mdMedia, $log, $scope, $stateParams, $document,
        EnvironmentConfig, AppFactory, DashboardSettingFactory, UnitFactory,
        DashboardFactory
    ) {
        var vm = this;
        var id = $stateParams.id;
        var contentMap = {}; // mapping for content using it's ID or temporary ID
        var tempId = 0; // Temporary ID to map for the newly added chart

        vm.page = {
            id: id,
            title: null,
            instansi_id: null
        };
        vm.tabs = [];
        vm.charts = {}; // content ID as key
        vm.chartTypes = [];
        vm.updateAction = updateAction;
        vm.cancelAction = DashboardSettingFactory.cancelAction;
        vm.deleteTab = deleteTab;
        vm.deleteContent = deleteContent;
        vm.showContentDialog = showContentDialog;
        vm.showTabDialog = showTabDialog;

        DashboardSettingFactory.getChartTypeList().then(function (res) {
            vm.chartTypes = res.data.data.items;
        });

        DashboardSettingFactory.getDashboardSetting(id).then(function (res) {
            angular.copy(res.data.data, vm.page);
            vm.searchTextInstansi = res.data.data.instansi ?
                                        res.data.data.instansi.nama : null;

            if (vm.page.page_content) {
                angular.forEach(vm.page.page_content, function (val) {
                    if (val.id > tempId) {
                        tempId = val.id + 1;
                    }
                    contentMap[val.id] = val;
                });
                vm.charts = convertContentsToCharts(contentMap);
            }

            vm.tabs = vm.page.page_tab;
            delete vm.page.page_tab; // remove unused element
            delete vm.page.page_content; // remove unused element
        });

        function deleteTab(tab) {
            tab.del = 1;
        }

        function deleteContent(contentId) {
            if (angular.isDefined(contentMap[contentId])) {
                contentMap[contentId].del = 1;
            }
            vm.charts = convertContentsToCharts(contentMap);
        }

        function buildRequestData() {
            var sanitizedData = {
                'title': vm.page.title,
                'instansi_id': vm.page.instansi_id
            };

            if (vm.tabs) {
                sanitizedData['page_tab'] = vm.tabs;
            }

            if (contentMap) {
                sanitizedData['page_content'] = [];
                angular.forEach(contentMap, function (v) {
                    sanitizedData['page_content'].push(v);
                });
            }
            return sanitizedData;
        }

        function updateAction() {
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'pages/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: buildRequestData()
            };
            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.dashboard-setting');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for Instansi ***/
        vm.selectedItemInstansi = null;
        vm.searchTextInstansi = null;
        vm.querySearchInstansi = UnitFactory.querySearchInstansi;
        vm.isDisabledInstansi = false;
        vm.noCacheInstansi = true;
        vm.selectedItemChangeInstansi = selectedItemChangeInstansi;

        function selectedItemChangeInstansi(item) {
            if (angular.isDefined(item)) {
                vm.page.instansi_id = item.id;
            } else {
                vm.page.instansi_id = null;
                vm.searchTextInstansi = null;
            }
        }
        /*** END - Autocomplete for Instansi ***/


        /**** BEGIN - Content Setting *****/
        function convertContentsToCharts(contents) {
            var convertedContents = {};
            angular.forEach(contents, function (val) {
                if (val.del === 0) {
                    var cols = [
                        {
                            lbl_id: 't',
                            label: 'Topping',
                            type: 'string'
                },
                {
                            lbl_id: 's',
                            label: 'Slices',
                            type: 'number'
                },
                {
                            lbl_id: 's',
                            label: 'Slices 2',
                            type: 'number'
                }
            ];
                    var rows = [
                        {
                            'debit': 'Mushrooms',
                    'kredit': 3,
                    'total': 5
                },
                {
                            'debit': 'Mushrooms 2',
                    'kredit': 10,
                    'total': 50
                }
            ];
                    convertedContents[val.id] = DashboardFactory.setupChart(
                        val.type_chart, val.tab_idx, val.title, '',
                        val.height, val.width, cols, rows
                    );
                }
            });
            return convertedContents;
        }

        function showContentDialog(id, predefinedTabIdx) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            var chartSetting = id ? contentMap[id] : null;
            $mdDialog.show({
                    controller: ContentDialogController,
                    templateUrl: 'app/dashboard-setting-module/content-dialog.tmpl.html',
                parent: angular.element($document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        chartSetting: chartSetting,
                        predefinedTabIdx: predefinedTabIdx,
                        chartTypes: vm.chartTypes
                    }
                })
                .then(function (dialogData) {
                    if (id) {
                        contentMap[id] = dialogData;
                    } else {
                        contentMap[++tempId] = dialogData;
                    }
                    vm.charts = convertContentsToCharts(contentMap);
                }, function () {
                });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function showTabDialog(index, tab) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            var existingTab = tab ? tab : null;
            $mdDialog.show({
                    controller: TabDialogController,
                    templateUrl: 'app/dashboard-setting-module/tab-dialog.tmpl.html',
                parent: angular.element($document.body),
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        data: existingTab
                    }
                })
                .then(function (dialogData) {
                    if (index) {
                        vm.tabs[index] = dialogData;
                    } else {
                        vm.tabs.push(dialogData);
                    }
                }, function () {
                });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }
        /*** END - Content Setting *****/
    }
})();
