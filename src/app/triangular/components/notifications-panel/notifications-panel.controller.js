(function () {
    'use strict';

    angular
        .module('triangular.components')
        .controller('NotificationsPanelController', NotificationsPanelController);

    /* @ngInject */
    function NotificationsPanelController(
        $scope, $rootScope, $mdSidenav, $state, $http, AppFactory,
        EnvironmentConfig, MenuService, FormFactory
    ) {
        var vm = this;

        $rootScope.notificationGroups = [];
        $rootScope.announcements = [];

        // sets the current active tab
        vm.close = close;
        vm.openForm = openForm;
        vm.openReport = openReport;
        vm.currentTab = 0;

        vm.openMail = openMail;
        vm.downloadAttachment = downloadAttachment;
        vm.readNotif = readNotif;
        vm.settingsGroups = [{
            name: 'ADMIN.NOTIFICATIONS.ACCOUNT_SETTINGS',
            settings: [{
                title: 'ADMIN.NOTIFICATIONS.SHOW_LOCATION',
                icon: 'zmdi zmdi-pin',
                enabled: true
            }, {
                title: 'ADMIN.NOTIFICATIONS.SHOW_AVATAR',
                icon: 'zmdi zmdi-face',
                enabled: false
            }, {
                title: 'ADMIN.NOTIFICATIONS.SEND_NOTIFICATIONS',
                icon: 'zmdi zmdi-notifications-active',
                enabled: true
            }]
        }, {
            name: 'ADMIN.NOTIFICATIONS.CHAT_SETTINGS',
            settings: [{
                title: 'ADMIN.NOTIFICATIONS.SHOW_USERNAME',
                icon: 'zmdi zmdi-account',
                enabled: true
            }, {
                title: 'ADMIN.NOTIFICATIONS.SHOW_PROFILE',
                icon: 'zmdi zmdi-account-box',
                enabled: false
            }, {
                title: 'ADMIN.NOTIFICATIONS.ALLOW_BACKUPS',
                icon: 'zmdi zmdi-cloud-upload',
                enabled: true
            }]
        }];

        vm.statisticsGroups = [{
            name: 'ADMIN.NOTIFICATIONS.USER_STATS',
            stats: [{
                title: 'ADMIN.NOTIFICATIONS.STORAGE_SPACE',
                mdClass: 'md-primary',
                value: 60
            }, {
                title: 'ADMIN.NOTIFICATIONS.BANDWIDTH_USAGAE',
                mdClass: 'md-accent',
                value: 10
            }, {
                title: 'ADMIN.NOTIFICATIONS.MEMORY_USAGAE',
                mdClass: 'md-warn',
                value: 100
            }]
        }, {
            name: 'ADMIN.NOTIFICATIONS.SERVER_STATS',
            stats: [{
                title: 'ADMIN.NOTIFICATIONS.STORAGE_SPACE',
                mdClass: 'md-primary',
                value: 60
            }, {
                title: 'ADMIN.NOTIFICATIONS.BANDWIDTH_USAGAE',
                mdClass: 'md-accent',
                value: 10
            }, {
                title: 'ADMIN.NOTIFICATIONS.MEMORY_USAGAE',
                mdClass: 'md-warn',
                value: 100
            }]
        }];

        ////////////////

        // add an event to switch tabs (used when user clicks a menu item before sidebar opens)
        $scope.$on('triSwitchNotificationTab', function ($event, tab) {
            vm.currentTab = tab;
        });

        // fetch some dummy emails from the API
        /*$http({
         method: 'GET',
         url: EnvironmentConfig.api + 'email/inbox'
         }).success(function(data) {
         vm.emails = data.slice(1,20);
         });*/

        function openMail() {
            $state.go('private.admin.toolbar.inbox');
            vm.close();
        }

        function close() {
            $mdSidenav('notifications').close();
        }

        function openForm(tautan, formId, keyId, newTab, prosesId) {
            MenuService.openLink(tautan, formId, keyId, newTab, prosesId);
        }

        function openReport(tautan) {
            FormFactory.downloadReportPesan(tautan);
        }

        function downloadAttachment(downloadUrl) {
            try {
                var req = {
                    method: 'GET',
                    url: downloadUrl,
                    transformResponse: undefined, // do not parse as JSON
                    responseType: 'arraybuffer'
                };

                return $http(req)
                    .success(function(res, status, headers) {
                        var parsedStream = AppFactory.parseFileStream(res, status, headers);
                        saveAs(parsedStream.blob, parsedStream.name);
                    })
                    .error(function(data){
                        var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                        var obj = angular.fromJson(decodedString);
                        if (obj.message) {
                            AppFactory.showToast(obj.message, 'error', obj.errors);
                        }
                    });
            } catch (ex) {
                AppFactory.showToast(ex, 'error');
            }
        }

        function readNotif(pesanId){
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'pesan/read',
                headers: {
                    'Content-Type': 'application/json'
                },
                data : {
                    'id' : pesanId
                }
            };
            $http(req)
                .success(function(){
                    $state.reload();
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
