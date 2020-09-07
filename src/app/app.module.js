(function () {
    'use strict';

    angular
        .module('app', [
            'triangular',
            'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngMaterial', 'myApp.config',
            'ui.router', 'pascalprecht.translate', 'LocalStorageModule', 'googlechart', 'chart.js', 'linkify',
            'ui.calendar', 'angularMoment', 'textAngular', 'uiGmapgoogle-maps', 'hljs', 'md.data.table',
            angularDragula(angular), 'ngFileUpload', 'satellizer', 'ivh.treeview', 'ui-leaflet', 'app.admin',
            'dashboard-module','admin-profile-module', 'desa-module', 'kecamatan-module', 'kabupaten-module',
            'provinsi-module', 'pengguna-module', 'peran-module', 'pegawai-module', 'menu-module',
            'unit-module', 'kamus-data-module', 'alur-proses-module', 'jenis-proses-module', 'pengguna-gateway-module',
            'jenis-izin-module', 'permohonan-izin-module', 'proses-pengajuan-module', 'template-data-module',
            'bidang-usaha-module', 'jenis-usaha-module', 'template-form-module', 'form-module', 'tarif-izin-module',
            'retribusi-module', 'penomoran-module', 'kalender-module', 'notifikasi-module', 'service-eksternal-module',
            'pemohon-module', 'perusahaan-module', 'izin-module', 'simulasi-tarif-module', 'jenis-dokumen-module',
            'pemohon-register-module', 'report-component-module', 'jabatan-module', 'pengguna-rest-module',
            'rest-service-module', 'signature-module', 'daftar-izin-module', 'profile-pemohon-module',
            'pengumuman-module', 'dashboard-setting-module', 'aduan-module', 'penanganan-aduan-module',
            'posisi-module', 'profile-pegawai-module', 'ngMaterialDatePicker',
            'faq-category-module', 'faq-setting-module', 'faq-module', 'maps-module',
            'inovasi-aduan-module','proses-pengembangan-module',
            'proses-nib-module', 'form-assessment-module', 'jkAngularRatingStars'
        ])
        // create a constant for languages so they can be added to both triangular & translate
        .constant('APP_LANGUAGES', [{
            name: 'LANGUAGES.CHINESE',
            key: 'zh'
        }, {
            name: 'LANGUAGES.ENGLISH',
            key: 'en'
        }, {
            name: 'LANGUAGES.FRENCH',
            key: 'fr'
        }, {
            name: 'LANGUAGES.PORTUGUESE',
            key: 'pt'
        }])

    .constant('_', window._)

    .run(runApp)

    .constant('APP_CONFIG', {
        'localStorageKey': btoa(window.location.origin + 'sicUser'), // Auth Key
        'menuStorageKey': btoa(window.location.origin + 'sicMenu'), // Menu Key
        'datepickerFormat': 'DD-MM-YYYY',
        'datetimepickerFormat': 'YYYY-MM-DD HH:mm'
    })

    .constant('DYNAMIC', {
        'typeForm': 'form',
        'typeTable': 'tabel',
        'typeTab': 'tab',
        'typeStaticTable': 'tabel-statik',
        'typeGridTable': 'tabel-grid',
        'outputDokumenCetak': 'Dokumen Cetak'
    })

        .filter('orderObjectBy', function(){
            return function(input, attribute) {
                if (!angular.isObject(input)) return input;

                var array = [];
                for(var objectKey in input) {
                    array.push(input[objectKey]);
                }

                array.sort(function(a, b){
                    a = parseInt(a[attribute]);
                    b = parseInt(b[attribute]);
                    return a - b;
                });
                return array;
            };
        })

    .service('MenuService', MenuService)

    .factory('TreeFactory', TreeFactory)

    .factory('AppFactory', AppFactory)

    .factory('SsoFactory', SsoFactory)

    /** interceptor to show loader when doing ajax request */
    .factory('httpInterceptor', function($q, $rootScope) {
        var numLoadings = 0;

        return {
            request: function(config) {
                numLoadings++;

                // Show loader
                $rootScope.$broadcast('loader_show');
                return config || $q.when(config);
            },
            response: function(response) {
                if ((--numLoadings) === 0) {
                    // Hide loader
                    $rootScope.$broadcast('loader_hide');
                }

                return response || $q.when(response);
            },
            responseError: function(response) {
                if (!(--numLoadings)) {
                    // Hide loader
                    $rootScope.$broadcast('loader_hide');
                }

                return $q.reject(response);
            }
        };
    })

    .service('authInterceptor', function($q, $log, $injector, APP_CONFIG) {
        var service = this;

        service.responseError = function(response) {
            if (response.status === 401 || response.status === 404) {
                $log.error(response.status);
                localStorage.removeItem(APP_CONFIG.localStorageKey);
                $injector.get('$rootScope').authenticated = false;
                $injector.get('$rootScope').currentUser = null;
                $injector.get('$state').go('authentication.login');
            }
            return $q.reject(response);
        };
    })

    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('httpInterceptor');
    }])

    // Editable Checkbox
    .directive('asciiBox', function(ivhTreeviewMgr) {
        return {
            restrict: 'AE',
            require: '^ivhTreeview',
            template: [
                '<span class="ascii-box">[',
                '<span ng-show="node.selected" class="x">v</span>',
                '<span ng-show="node.__ivhTreeviewIndeterminate" class="y">~</span>',
                '<span ng-hide="node.selected || node.__ivhTreeviewIndeterminate"> </span>',
                ']</span>'
            ].join(''),
            link: function(scope, element, attrs, ctrl) {
                element.on('click', function() {
                    ivhTreeviewMgr.select(ctrl.root(), scope.node, !scope.node.selected);
                    scope.$apply();
                });
            }
        };
    })

    // Checkbox for View Only
    .directive('asciiBoxView', function( /*ivhTreeviewMgr*/ ) {
        return {
            restrict: 'AE',
            require: '^ivhTreeview',
            template: [
                '<span class="ascii-box-view">[',
                '<span ng-show="node.selected" class="x">v</span>',
                '<span ng-show="node.__ivhTreeviewIndeterminate" class="y">~</span>',
                '<span ng-hide="node.selected || node.__ivhTreeviewIndeterminate"> </span>',
                ']</span>'
            ].join(''),
            link: function(scope, element, attrs, ctrl) {}
        };
    })

    // Directive for Combogrid Initialization
    .directive('myCombogrid', function($parse, $log, $auth) {
        return {
            restrict: 'A',
            scope: {
                'cgModel': '=',
                'cgLabelModel': '=',
                'cgUrl': '@' // Isolated Scope
            },
            link: function(scope, element, attrs) {
                // Two Way Binding by watching changes outside
                // scope.$watch('cgModel', function (newValue, oldValue) {
                // console.log('value changed, new value is: ' + newValue);
                // });

                scope.$watch('cgUrl', function(newValue, oldValue) {
                    $log.info('CG Url changed, old value is: ' + oldValue);
                    $log.info('CG Url changed, new value is: ' + newValue);
                    initCombogrid();
                });

                // Observer any change on cgUrl attribute
                // Similar to $watch, but without isolate scope
                // attrs.$observe('cgUrl', function(v) {
                //     initCombogrid();
                // }, true);

                // Process to be done when selecting record from combogrid
                var processSelect = function(event, ui) {
                    scope.$apply(function(scope) {
                        scope.cgModel = ui.item[attrs.cgValueCol];
                        scope.cgLabelModel = ui.item[attrs.cgLabelCol];
                    });
                    $(element).val(ui.item[attrs.cgLabelCol]);
                    return false;
                };

                // Initialize Combogrid
                var initCombogrid = function() {
                    attrs.cgFields = attrs.cgFields.trim();

                    if (attrs.cgFields && attrs.cgFields.length > 0 && angular.isString(attrs.cgFields)) {
                        attrs.cgFields = angular.fromJson(attrs.cgFields);

                        $(element).combogrid({
                            url: attrs.cgUrl,
                            colModel: attrs.cgFields,
                            select: processSelect,
                            datatype: 'json',
                            delay: 0,
                            // debug:true,
                            // replaceNull: true,
                            okIcon: true,
                            authorizationHeader: 'Bearer ' + $auth.getToken()
                        });

                        $(element).change(function() {
                            if ($(element).val().length === 0) {
                                scope.$apply(function(scope) {
                                    scope.cgModel = null;
                                    scope.cgLabelModel = null;
                                });
                            }
                        });
                    }
                };

                initCombogrid();
            }
        };
    })

    /*** Ajax Loader ***/
    .directive('loader', function() {
        return function($scope, element) {
            $scope.$on('loader_show', function() {
                return element.show();
            });
            return $scope.$on('loader_hide', function() {
                return element.hide();
            });
        };
    })

    /*.directive('myDirective', function() {
     return {
     require: 'ngModel',
     link: function(scope, element, attrs, ngModelController) {
     ngModelController.$parsers.push(function(data) {
     //convert data from view format to model format
     return data; //converted
     });

     ngModelController.$formatters.push(function(data) {
     //convert data from model format to view format
     return data; //converted
     });
     }
     }
     })*/
    ;

    function runApp($rootScope, $state, $log, $window, MenuService, APP_CONFIG) {

        // $stateChangeStart is fired whenever the state changes. We can use some parameters
        // such as toState to hook into details about the state as it is changing
        $rootScope.$on('$stateChangeStart', function(event, toState) {
            // Grab the user from local storage and parse it to an object
            var user = angular.fromJson(localStorage.getItem(APP_CONFIG.localStorageKey));

            if (user) {
                // If there is any user data in local storage then the user is quite
                // likely authenticated. If their token is expired, or if they are
                // otherwise not actually authenticated, they will be redirected to
                // the auth state because of the rejected request anyway

                // The user's authenticated state gets flipped to
                // true so we can now show parts of the UI that rely
                // on the user being logged in
                $rootScope.authenticated = true;

                // Putting the user's data on $rootScope allows
                // us to access it anywhere across the app. Here
                // we are grabbing what is in local storage
                $rootScope.currentUser = user;

                // If the user is logged in and we hit the auth route we don't need
                // to stay there and can send the user to the main state
                $log.info(toState.name);

                switch (toState.name) {
                    case 'authentication.login':
                        // Preventing the default behavior allows us to use $state.go
                        // to change states
                        event.preventDefault();

                        // go to the "main" state which in our case is users
                        if (user.peran.home_path) {
                            MenuService.openLink(user.peran.home_path);
                        } else {
                            $rootScope.$broadcast('routeChange');
                            $state.go('triangular.admin-default.home');
                        }
                        break;
                    case 'triangular.admin-default.home':
                        MenuService.getAppMenu();
                        break;
                    default:
                        MenuService.getCachedMenu();
                        // TODO reload the menu from api if main menu is not home
                        break;
                }

                // do not remove this
                $rootScope.$broadcast('routeChange');
            }
        });

        $rootScope.$on('routeChange', handleRouteChange);

        function handleRouteChange() {
            // Get the uri with hash
            var uri = $window.location.hash;
            uri = uri.substr(2, (uri.length - 2));

            if (uri.substr(0, 6) === 'reset/') {
                uri = 'reset';
            }
            if (uri.substr(0, 7) === 'verify/') {
                uri = 'verify';
            }
            if (uri.substr(0, 6) === 'login/') {
                uri = 'login';
            }

            var publicUri = ['login', 'register', 'forgot', 'reset', 'verify'];
            if (publicUri.indexOf(uri) > -1) {
                return;
            }

            var lastActive = localStorage.getItem('lastActive');
            var idleTime = moment(lastActive).add(2, 'hours');

            if (idleTime < new Date()) { // auto logout setiap 2 jam idle
                localStorage.removeItem(APP_CONFIG.localStorageKey);
                localStorage.removeItem(APP_CONFIG.menuStorageKey);
                localStorage.removeItem('lastActive');
                $state.go('authentication.login');
            }

            localStorage.setItem('lastActive', new Date());
            MenuService.validateAccess(uri).then(function() {
                MenuService.getNotifications();
            });
        }
    }

    /* @ngInject */
    function MenuService(
        $http, EnvironmentConfig, APP_CONFIG, _, $state, $rootScope, $log, triMenu, $window,
        AppFactory, AdminProfileFactory
    ) {
        this.getAppMenu = getAppMenu;
        this.getCachedMenu = getCachedMenu;
        this.parseMenu = parseMenu;
        this.openLink  = openLink;
        this.openTautan= openTautan;
        this.validateAccess = validateAccess;
        this.getNotifications = getNotifications;

        ////////////////
        // Get the Menu Data from Web Service
        function getAppMenuData() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'menu/appmenu',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(req)
                .success(function(res) {
                    var menuData = res.data;
                    localStorage.setItem(APP_CONFIG.menuStorageKey, angular.toJson(menuData));
                })
                .error(function(err, status) {
                    if (status === 500 || status === 401) {
                        // Remove the authenticated user from local storage
                        localStorage.removeItem(APP_CONFIG.localStorageKey);

                        // Flip authenticated to false so that we no longer
                        // show UI elements dependant on the user being logged in
                        $rootScope.authenticated = false;

                        // Remove the current user info from rootscope
                        $rootScope.currentUser = null;

                        $state.go('authentication.login');
                    }
                });
        }

        // Load and Parse The Menu
        function getAppMenu() {
            // Load The Menu
            getAppMenuData().then(function(res) {
                var menuData = res.data.data;
                var parsedMenu = parseMenu(menuData);
                if (parsedMenu.length > 0) {
                    // Remove All Menu
                    triMenu.removeAllMenu();

                    parsedMenu.forEach(
                        function(menu) {
                            triMenu.addMenu(menu);
                        }
                    );
                }
            });
        }

        // Load and parse the Cached Menu
        function getCachedMenu() {
            var storedMenu = localStorage.getItem(APP_CONFIG.menuStorageKey);

            if (storedMenu) {
                var parsedMenu = parseMenu(angular.fromJson(storedMenu));
                if (parsedMenu.length > 0) {
                    // Remove All Menu
                    triMenu.removeAllMenu();

                    // Add Home Menu
                    // triMenu.addMenu({
                    //     name: 'Home',
                    //     icon: 'zmdi zmdi-grade',
                    //     type: 'link',
                    //     priority: 0.0,
                    //     state: 'triangular.admin-default.home'
                    // });

                    parsedMenu.forEach(function(menu) {
                        triMenu.addMenu(menu);
                    });
                }
            } else {
                getAppMenu();
            }
        }

        // Parse Menu Data for triMenu
        function parseMenu(menuData) {
            var result = [];

            if (menuData.length > 0) {
                menuData.forEach(function(value, index) {
                    var arrangedData = {
                        name: value.label_menu,
                        icon: 'zmdi zmdi-grade',
                        priority: index
                    };

                    // Set icon if provided
                    if (value.icon) {
                        arrangedData.icon = value.icon;
                    }

                    if (value.children.length > 0) {
                        arrangedData.type = 'dropdown';
                        arrangedData.children = parseMenu(value.children);
                    } else {
                        arrangedData.type = 'link';
                        // arrangedData.state = 'triangular.admin-default.' + value.tautan;
                        arrangedData.uri = value.tautan;
                    }
                    result.push(arrangedData);
                });
            }
            return result;
        }

        function validateAccess(uri) {
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'menu/validateAccess',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    'uri': uri
                }
            };

            return $http(req)
                .error(function(err) {
                    if (!_.isNull(err) && angular.isDefined(err.message)) {
                        AppFactory.showToast(err.message);
                    } else {
                        AppFactory.showToast('Anda tidak dapat mengakses menu ini', 'error');
                    }
                    $state.go('authentication.login');
                });
        }

        function getNotifications() {
            var query = {
                filter: '',
                limit: 10,
                order: '-id',
                page: 1,
                tipe: 'announcement',
                grouped: 'F'
            };
            moment.locale("id");
            var numAnnouncement = 0;

            // Get Announcements and total number of annoucements
            AdminProfileFactory.getNotifications(query).then(function (res) {
                numAnnouncement = res.data.data.total_items;
                var data = res.data.data.items;
                var announcements = [];

                _.each(data, function (val) {
                    announcements.push({
                        title: val.pesan,
                        message: val.pesan,
                        icon: 'zmdi zmdi-alert-circle',
                        iconColor: '#55acee',
                        date: val.tgl_dibuat,
                        attachment_name: val.file_lampiran,
                        attachment_url: val.url_lampiran
                    });
                });
                angular.copy(announcements, $rootScope.announcements);

                // Get General Notifications and total number of notifications
                query.tipe = 'general';
                query.grouped = 'T';

                AdminProfileFactory.getNotifications(query).then(function (res) {
                    $rootScope.numNotification = numAnnouncement + res.data.data.total_items;
                    var data = res.data.data.items;
                    var notificationGroups = [];

                    _.each(data, function (values, key) {
                        var notificationGroup = {
                            'name': key,
                            'notifications': [],
                            'icon': 'zmdi zmdi-alert-circle',
                            'iconColor': '#55acee'
                        };
                        _.each(values, function (val) {
                            notificationGroup.notifications.push({
                                id : val.id,
                                title: val.judul,
                                content: val.pesan,
                                tautan: val.tautan,
                                object_id: val.object_id,
                                pesan : val.pesan_dibaca,
                                date: moment(val.tgl_dibuat, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY-MM-DD HH:mm:ss')
                            });
                        });
                        notificationGroups.push(notificationGroup);
                    });
                    angular.copy(notificationGroups, $rootScope.notificationGroups);
                });
            });
        }

        // Open state or internal link
        function openLink(link, formId, keyId, newTab, prosesPermohonanId) {
            try {
                // If detected as Link
                $log.info('Link: ' + link);
                $log.info('formId: ' + formId);
                $log.info('keyId: ' + keyId);

                if (link.indexOf('/') === 0) {
                    link = link.substr(1, link.length - 1);
                }

                if (link.indexOf('/') > 0 && link.indexOf('.') === -1) {
                    var linkToOpen = '#/' + link;

                    if (angular.isDefined(keyId) && !_.isNull(keyId) && keyId.toString().length > 0) {
                        linkToOpen += '/' + keyId;
                    }

                    // we need to broadcast routeChange because of window object
                    // normally, routeChange will be triggered on $stateChangeStart
                    $rootScope.$broadcast('routeChange');
                    if (angular.isDefined(newTab) && newTab === true) {
                        $window.open(linkToOpen);
                    } else {
                        $window.location.href = linkToOpen;
                    }
                } else { // Otherwise will be treated as state
                    $state.go('triangular.admin-default.' + link, {
                        'permohonan_id': keyId,
                        'key_id': keyId,
                        'form_id': formId,
                        'proses_permohonan_id': prosesPermohonanId
                    });
                }
            } catch (ex) {
                $log.error(ex.message);
            }
            return;
        }

        function openTautan(link) {
            try {
                // If detected as Link
                if (link.indexOf('/') === 0) {
                    link = link.substr(1, link.length - 1);
                }

                var linkToOpen = '#/' + link;
                $window.open(linkToOpen);
            } catch (ex) {
                $log.error(ex.message);
            }
            return;
        }
    }

    function TreeFactory() {
        return {
            getSelectedNodeValues: getSelectedNodeValues,
            buildTreeData: buildTreeData
        };

        function getSelectedNodeValues(treeData) {
            var nodeValues = [];

            if (treeData.length > 0) {
                treeData.forEach(function(val) {
                    var parentIncluded = false;

                    if (val.selected) {
                        nodeValues = nodeValues.concat(val.value);
                        parentIncluded = true;
                    }

                    if (angular.isDefined(val.children)) {
                        if (val.children.length > 0) {
                            var childrenValues = getSelectedNodeValues(val.children);
                            if (childrenValues.length > 0) {
                                // If the parent is not included in array, add the parent
                                if (!parentIncluded) {
                                    nodeValues.push(val.value);
                                }
                                nodeValues = nodeValues.concat(childrenValues);
                            }
                        }
                    }
                });
            }
            return nodeValues;
        }

        function buildTreeData(menuData) {
            var result = [];

            if (menuData.length > 0) {
                menuData.forEach(function(value) {
                    var arrangedData = {
                        value: value.id,
                        label: value.label,
                        selected: value.is_selected
                    };

                    if (value.children.length > 0) {
                        arrangedData.children = buildTreeData(value.children);
                    }

                    result.push(arrangedData);
                });
            }
            return result;
        }
    }

    /** AppFactory **/
    function AppFactory($mdToast, $http, _, APP_CONFIG, EnvironmentConfig) {
        return {
            showToast: showToast,
            httpBuildQuery: httpBuildQuery,
            clone: clone,
            getMaxBirthDate: getMaxBirthDate,
            syntaxHighlight: syntaxHighlight,
            parseFileStream: parseFileStream,
            downloadFile: downloadFile,
            getDownloadURL: getDownloadURL,
            getUserData: getUserData,
            isTopAdministrator: isTopAdministrator
        };

        function showToast(message, type, errors) {
            try {
                var position = 'bottom right';
                var hideDelay = 5000;
                var msg = message.toString();
                var tmpl = '';

                switch (type) {
                    case 'error':
                        hideDelay = 8000;

                        // If errors object is passed, use that instead of message string
                        if (angular.isDefined(errors)) {
                            var strErrors = parseError(errors);

                            if (strErrors.length > 0) {
                                msg = strErrors;
                            }
                        }

                        tmpl = '<md-toast class="md-toast-error"><span flex>' + msg + '</span></md-toast>';
                        break;
                    case 'warning':
                        tmpl = '<md-toast class="md-toast-warning"><span flex>' + msg + '</span></md-toast>';
                        break;
                    default:
                        tmpl = '<md-toast><span flex>' + msg + '</span></md-toast>';
                        break;
                }

                $mdToast.show({
                    template: tmpl,
                    position: position,
                    hideDelay: hideDelay
                });

            } catch (ex) {
                $mdToast.show({
                    template: '<md-toast><span flex>' + ex.message + '</span></md-toast>',
                    position: 'top right',
                    hideDelay: 8000
                });
            }
        }

        function parseError(errors) {
            var strErrors = '';
            for (var key in errors) {
                if (errors.hasOwnProperty(key)) {
                    var error = errors[key];

                    if (angular.isObject(error)) {
                        strErrors += _.capitalize(key) + '-' + parseError(error);
                    }

                    if (angular.isString(error)) {
                        strErrors += _.capitalize(key) + ': ' + error + ', ';
                    }
                }
            }

            return strErrors;
        }

        function httpBuildQuery(params) {
            if (angular.isUndefined(params) || !angular.isObject(params)) {
                params = {};
                return params;
            }

            var query = '?';
            var index = 0;

            for (var i in params) {
                index++;
                var param = i;
                var value = params[i];

                // Convert date to string
                if (value instanceof Date) {
                    value = moment(value).format(APP_CONFIG.datepickerFormat);
                }

                // convert param and value
                if (param === 'filter') {
                    param = 'q';
                }

                if (_.isNull(value) || angular.isUndefined(value)) {
                    value = '';
                }

                if (index === 1) {
                    query += param + '=' + value;
                } else {
                    query += '&' + param + '=' + value;
                }
            }

            return query;
        }

        function clone(obj) {
            var copy;

            // Handle the 3 simple types, and null or undefined
            if (_.isNull(obj) || !angular.isObject(obj)) return obj;

            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = clone(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) {
                        copy[attr] = clone(obj[attr]);
                    }
                }
                return copy;
            }

            throw new Error('Unable to copy obj! Its type isn\'t supported.');
        }

        function getMaxBirthDate() {
            return moment().subtract(17, 'years').toDate();
        }

        function syntaxHighlight(json) {
            if (!angular.isString(json)) {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    cls = 'string';
                    if (/:$/.test(match)) {
                        cls = 'key';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }

        /**
         * Helper for parsing file stream
         * @param res
         * @param status
         * @param headers
         * @returns {{blob: Blob, name: string}}
         */
        function parseFileStream(res, status, headers) {
            var fileName = 'download.pdf';
            var fileType = 'application/download';

            // Try to get filename from header
            var contentDisposition = headers('Content-Disposition');
            if (contentDisposition) {
                var splitContentDisposition = contentDisposition.split(';');
                if (splitContentDisposition.length >= 2) {
                    var splitFilename = splitContentDisposition[1].trim().split('=');
                    if (splitFilename.length >= 2) {
                        fileName = splitFilename[1].split('"').join(''); // replace all occurences of double quote
                    }
                }
            }

            // Try to get filetype from header
            var contentType = headers('Content-Type');
            var splitContentType = contentType.split(';');
            if (splitContentType.length >= 2) {
                var splitFileType = splitContentType[0].trim().split(';');
                fileType = splitFileType[0].split('"').join('');
            }

            // Create file from response
            var file = new Blob([res], {
                type: fileType
            });

            return {
                blob: file,
                name: fileName
            };
        }

        // return URL path for file download
        function getDownloadURL(filename, folder) {
            var path = '';
            folder = angular.isDefined(folder) ? folder : 'upload';

            switch (folder) {
                case 'signed':
                    path = 'ProsesPermohonan/downloadSignedReport?filename=' + filename;
                    break;
                default:
                    path = 'Form/downloadFile?filename=' + filename + '&foldername=' + folder;
                    break;
            }

            return EnvironmentConfig.api + path + '&force=F';
        }

        function downloadFile(filePath, folder) {
            var url = getDownloadURL(filePath, folder);

            var req = {
                method: 'GET',
                url: url,
                transformResponse: undefined, // do not parse as JSON
                responseType: 'arraybuffer'
            };

            return $http(req)
                .success(function (res, status, headers) {
                    var parsedStream = parseFileStream(res, status, headers);
                    saveAs(parsedStream.blob, parsedStream.name);
                })
                .error(function (data) {
                    var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                    var obj = angular.fromJson(decodedString);
                    if (obj.message) {
                        AppFactory.showToast(obj.message, 'error', obj.errors);
                    }
                });
        }

        function getUserData() {
            return angular.fromJson(localStorage.getItem(APP_CONFIG.localStorageKey));
        }

        // Check if user is top administator
        function isTopAdministrator() {
            var user = angular.fromJson(localStorage.getItem(APP_CONFIG.localStorageKey));
            return (user && _.isNull(user.instansi_id));
        }
    }

    /** .AppFactory **/

    function SsoFactory(
        $state, $http, $mdToast, $auth, $rootScope, $log, $cookies, EnvironmentConfig, MenuService, APP_CONFIG, AppFactory
    ) {

        return {
            initSso: initSso,
            loginSso: loginSso,
            autoLogin: autoLogin
        };

        function initSso(data){
            /* var data = {};
            var req = {
                method: 'JSONP',
                url: EnvironmentConfig.ssoOssApi+'&callback=JSON_CALLBACK',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: data
            };

            return $http(req); */
            //perubahan API ke 2
            var url = EnvironmentConfig.rest + 'OssLogin/getssotoken';
            var req = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            return $http(req)
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function loginSso(loginData, ssoParams){
            loginData['token'] = ssoParams['token'];
            var data = {
                'LOGINSSO': loginData
            };

           /*TODO : Dihapus jika design sudah settle
            var req = {
                method: 'JSONP',
                url: EnvironmentConfig.ssoOssApi+'&callback=JSON_CALLBACK&username='+data.username+'&password='+data.password,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                data: data
            }; */

            var req = {
                method: 'POST',
                url: ssoParams['api_sso']+'sso/loginSSO',
                headers: {
                    'Content-Type': 'application/json',
                    'OSS-API-KEY': ssoParams['key']
                },
                data: data
            };

            return $http(req);
        }

        function autoLogin(kdIzin, token) {
            var getUser = {
                method: 'GET',
                url: EnvironmentConfig.rest + 'OssLogin/getusername/' + token + '/' + kdIzin,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };
            
            return $http(getUser);
            /* .success(function(res) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'pengguna/ssologin/' + res.data.username + '/' + kdIzin,
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    }
                };

                return $http(req).success(function(res) {
                    $http.defaults.headers.common.Authorization = 'Bearer '+res.data;
                });
            }); */
        }
    }
})();
