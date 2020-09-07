(function () {
    'use strict';

    angular
        .module('template-form-module')
        .controller('TemplateFormEditController', TemplateFormEditController);

    /* @ngInject */
    function TemplateFormEditController(
      $http, $state, EnvironmentConfig, $stateParams, $log, $scope, $mdDialog, $mdMedia, $document,
      AppFactory, TemplateFormFactory, ServiceEksternalFactory
    ) {
        var vm = this;
        var id = $stateParams.form_id;

        $scope.status = '';
        $scope.forms = [];

        vm.template_form = {
            'nama_form': null,
            'key_field': null,
            'otomatis_update': 0,
            'target_simpan': null,
            'service_eksternal_id': null,
            'target_path': null
        };

        $scope.otomatisUpdateList = TemplateFormFactory.getOtomatisUpdateList();
        $scope.targetSimpanList = TemplateFormFactory.getTargetSimpanList();

        $scope.addForm = function () {
            $scope.forms = [];
        };

        $scope.delElm = function (data) {
            data.del = true;
        };

        $scope.addOpt = function (data) {
            if (data.options == null) {
                data.options = [{
                    id: 'test',
                    name: 'test'
                }];
            } else {
                data.options.push({
                    id: 'test',
                    name: 'test'
                });
            }
        };

        TemplateFormFactory.getTemplateForm(id).then(function (res) {
            var templateFormData = res.data.data;

            $scope.forms = templateFormData.canvas;
            $scope.enableActionButton = true;

            vm.template_form.nama_form = templateFormData.nama_form;
            vm.template_form.key_field = templateFormData.key_field;
            vm.template_form.otomatis_update = parseInt(templateFormData.otomatis_update);
            vm.template_form.target_simpan = templateFormData.target_simpan;
            vm.template_form.service_eksternal_id = templateFormData.service_eksternal_id;
            vm.template_form.target_path = templateFormData.target_path;

            // Load name of selected Template data
            if (angular.isDefined(vm.template_form.service_eksternal_id) && vm.template_form.service_eksternal_id) {
                ServiceEksternalFactory.getServiceEksternal(vm.template_form.service_eksternal_id).then(function (res) {
                    $scope.searchTextOtomatisUpdate = res.data.data.nama;
                });
            }

            if ($scope.forms) {
                $scope.enableFilter = false;

                for (var formIndex = 0; formIndex < $scope.forms.length; formIndex++) {
                    var formData = $scope.forms[formIndex];
                    if (formData.ftype === 'tabel' || formData.ftype === 'tabel-grid' || formData.ftype === 'tabel-statik') {
                        $scope.enableFilter = true;
                        return;
                    }
                }
            }
        });

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        vm.cancelAction = TemplateFormFactory.cancelAction;

        $scope.showCanvas = showCanvas;
        $scope.editCanvas = editCanvas;
        $scope.editFilterCanvas = editFilterCanvas;
        $scope.deleteCanvas = deleteCanvas;
        $scope.deleteTab = deleteTab;
        $scope.showInitialCanvasFormat = showInitialCanvasFormat;
        $scope.enableActionButton = false;
        $scope.showActionButton = showActionButton;
        $scope.configureCanvasActionButton = configureCanvasActionButton;
        $scope.enableFilter = true;
        $scope.showFilterSetting = showFilterSetting;
        $scope.showElement = showElement;
        $scope.showOption = showOption;
        $scope.showSource = showSource;
        $scope.showNumbering = showNumbering;
        $scope.showButton = showButton;
        $scope.showTab = showTab;
        $scope.showPrerenderedDialog = showPrerenderedDialog;
        $scope.uploadFile = uploadFile;
        $scope.saveForm = saveForm;

        function showCanvas(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: canvasDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            .then(function (data) {
                if (!$scope.forms) {
                    $scope.forms = [];
                }

                $scope.forms.push({
                    tabIdx: data[0].fields[0].field[0].data,
                    ftype: data[0].fields[0].field[1].data,
                    fName: data[0].fields[0].field[2].data,
                    initial_ws: data[0].fields[0].field[3].data,
                    datatabel: data[0].fields[0].field[4].data,
                    no_urut: data[0].fields[0].field[5].data,
                    del: false,
                    fields: [{
                        id: null,
                        del: false,
                        field: []
                    }]
                });
                $scope.enableActionButton = true;

                if ($scope.forms) {
                    $scope.enableFilter = false;

                    for (var formIndex = 0; formIndex < $scope.forms.length; formIndex++) {
                        var formData = $scope.forms[formIndex];
                        if (formData.ftype === 'tabel' || formData.ftype === 'tabel-grid' || formData.ftype === 'tabel-statik') {
                            $scope.enableFilter = true;
                            return;
                        }
                    }
                }

            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function editCanvas(ev, canvasData) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: editCanvasDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    canvasData: canvasData
                }
            })
            .then(function (data) {
                canvasData.tabIdx = data[0].fields[0].field[0].data;
                canvasData.ftype = data[0].fields[0].field[1].data;
                canvasData.fName = data[0].fields[0].field[2].data;
                canvasData.initial_ws = data[0].fields[0].field[3].data;
                canvasData.datatabel = data[0].fields[0].field[4].data;
                canvasData.no_urut = data[0].fields[0].field[5].data;
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function editFilterCanvas(ev, canvasData) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: editFilterCanvasDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    canvasData: canvasData
                }
            })
            .then(function (data) {
                canvasData.template_data_id = data[0].fields[0].field[0].data;
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function deleteCanvas(ev, canvasIndex, canvasData) {
            var dialog = {
                title: 'Apakah anda yakin?',
                content: 'Canvas yang sudah dihapus tidak dapat dikembalikan!',
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
                // If canvas has id
                if (canvasData.id !== undefined) {
                    TemplateFormFactory.deleteCanvas(canvasData.id).then(function () {
                        canvasData.del = true;
                    });
                } else {
                    canvasData.del = true;
                }
            });
        }

        function deleteTab(ev, tabData) {
            var dialog = {
                title: 'Apakah anda yakin?',
                content: 'Tab yang sudah dihapus tidak dapat dikembalikan!',
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
                // If canvas has id
                if (angular.isDefined(tabData.id)) {
                    TemplateFormFactory.deleteCanvasTab(tabData.id).then(function () {
                        tabData.del = true;
                    });
                } else {
                    tabData.del = true;
                }
            });
        }

        function showInitialCanvasFormat(ev, canvasData) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: showInitialCanvasDialog,
                templateUrl: 'app/template-form-module/initial-web-service-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    canvasData: canvasData
                }
            })
            .then(function (data) {
                canvasData.tabIdx = data[0].fields[0].field[0].data;
                canvasData.ftype = data[0].fields[0].field[1].data;
                canvasData.fName = data[0].fields[0].field[2].data;
                canvasData.initial_ws = data[0].fields[0].field[3].data;
                canvasData.datatabel = data[0].fields[0].field[4].data;
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /**
         * Select Action button configuration to use
         * @param ev
         * @param elm
         */
        function showActionButton(ev, mode, elementData) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: actionButtonDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    type: 'form',
                    elementData: elementData
                }
            })
            .then(function (data) {
                var actionType = data[0].fields[0].field[0].data;
                var link = data[0].fields[0].field[1].data;
                var label = data[0].fields[0].field[2].data;
                var targetSimpan = data[0].fields[0].field[3].data;
                var serviceEksternalId = data[0].fields[0].field[4].data;
                var targetPath = data[0].fields[0].field[5].data;

                if (mode == 'edit') {
                    elementData.tombol_aksi = actionType;
                    elementData.tombol_tautan = link;
                    elementData.label = label;
                    elementData.target_simpan = targetSimpan;
                    elementData.service_eksternal_id = serviceEksternalId;
                    elementData.target_path = targetPath;
                } else {
                    // Check if first member of array is action
                    var actionButtonCreated = false;
                    var dataObj = {
                        id: null,
                        del: false,
                        label: label,
                        type: 'button-action',
                        required: false,
                        data_kolom_id: null,
                        data: null,
                        data_label: null,
                        tombol_aksi: actionType,
                        tombol_tautan: link,
                        target_simpan: targetSimpan,
                        service_eksternal_id: serviceEksternalId,
                        target_path: targetPath
                    };

                    if (angular.isObject($scope.forms[0])) {
                        if ($scope.forms[0].ftype === 'action') {
                            if (!$scope.forms[0].fields[0].field) {
                                $scope.forms[0].fields[0].field = [];
                            }

                            $scope.forms[0].fields[0].field.push(dataObj);
                            actionButtonCreated = true;
                        }
                    }

                    // If Row containing the action buttons is not exists
                    if (!actionButtonCreated) {
                        // Push to the beginning of array
                        $scope.forms.unshift({
                            tabIdx: -1,
                            ftype: 'action',
                            fName: null,
                            initial_ws: null,
                            datatabel: null,
                            del: false,
                            fields: []
                        });
                        $scope.forms[0].fields[0] = {
                            'field': [dataObj],
                            'del': false
                        };
                    }
                }
            }, function () {
                $scope.status = 'source';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /**
         * Configuration for Action button on tab
         * @param ev
         * @param elm
         */
        function configureCanvasActionButton(ev, targetCanvas, mode, elementData) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog
                .show({
                    controller: actionButtonDialog,
                    templateUrl: 'app/template-form-module/canvas.html',
                    parent: angular.element($document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {
                        type: 'form',
                        elementData: elementData
                    }
                })
                .then(function (data) {
                    var actionType = data[0].fields[0].field[0].data;
                    var link = data[0].fields[0].field[1].data;
                    var label = data[0].fields[0].field[2].data;
                    var targetSimpan = data[0].fields[0].field[3].data;
                    var serviceEksternalId = data[0].fields[0].field[4].data;
                    var targetPath = data[0].fields[0].field[5].data;

                    if (mode == 'edit') {
                        elementData.tombol_aksi = actionType;
                        elementData.tombol_tautan = link;
                        elementData.label = label;
                        elementData.target_simpan = targetSimpan;
                        elementData.service_eksternal_id = serviceEksternalId;
                        elementData.target_path = targetPath;
                    } else {
                        var dataObj = {
                            id: null,
                            del: false,
                            label: label,
                            type: 'button-action',
                            required: false,
                            data_kolom_id: null,
                            data: null,
                            data_label: null,
                            tombol_aksi: actionType,
                            tombol_tautan: link,
                            target_simpan: targetSimpan,
                            service_eksternal_id: serviceEksternalId,
                            target_path: targetPath
                        };

                        if (angular.isObject(targetCanvas)) {
                            if (!targetCanvas.fields[0].field) {
                                targetCanvas.fields[0].field = [];
                            }
                            targetCanvas.fields[0].field.push(dataObj);
                        }
                    }
                }, function () {
                    $scope.status = 'source';
                });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /**
         * Select Filter configurations to use
         * @param ev
         * @param elm
         */
        function showFilterSetting(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: filterDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    selectedButtonAction: null,
                    buttonLink: null,
                    type: 'form'
                }
            })
            .then(function (data) {
                var insertIndex = 1;
                var filterLabel = data[0].fields[0].field[0].data;
                var filterVar = data[0].fields[0].field[1].data;
                var filterType = data[0].fields[0].field[2].data;
                var filterObj = {
                    id: null,
                    del: false,
                    label: filterLabel,
                    type: filterType,
                    required: false,
                    data_kolom_id: null,
                    data: null,
                    data_label: null,
                    variable_name: filterVar
                };

                // Check if second member of array is filter
                var filterCreated = false;
                if (typeof ($scope.forms[0]) === 'object') {
                    if ($scope.forms[0].ftype === 'action') {

                        if (typeof ($scope.forms[1] === 'object')) {
                            if ($scope.forms[1].ftype === 'filter') {
                                $scope.forms[1].fields[0].field.push(filterObj);
                                filterCreated = true;
                            }
                        }
                    } else if ($scope.forms[0].ftype === 'filter') {
                        $scope.forms[0].fields[0].field.push(filterObj);
                        filterCreated = true;
                    } else {
                        // If first form is not action, insert filter to the first
                        insertIndex = 0;
                    }
                }

                // If Row containing the action buttons is not exists
                if (!filterCreated) {
                    var newItem = {
                        tabIdx: -1,
                        ftype: 'filter',
                        fName: null,
                        initial_ws: null,
                        datatabel: null,
                        del: false,
                        fields: [{
                            id: null,
                            del: false,
                            field: [filterObj]
                        }]
                    };

                    if (insertIndex === 0) {
                        // Insert to first element of forms array
                        $scope.forms.unshift(newItem);
                    } else {
                        // Insert to second index of the array
                        $scope.forms.splice(1, 0, newItem);
                    }
                }
            }, function () {
                $scope.status = 'source';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /**
         * Show Element Setting
         * @param ev
         * @param form
         */
        function showElement(ev, form, mode, elementData) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: elmDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    datatabelId: form.datatabel,
                    elementFormType: form.ftype,
                    currentElmType: elementData && elementData.hasOwnProperty('type') ? elementData.type : null,
                    currentElmRequired: elementData && elementData.hasOwnProperty('required') ? elementData.required : null,
                    currentElmDataKolom: elementData && elementData.hasOwnProperty('data_kolom') ? elementData.data_kolom : null,
                    currentElmDataKolomId: elementData && elementData.hasOwnProperty('data_kolom_id') ? elementData.data_kolom_id : null,
                    currentElmLabel: elementData && elementData.hasOwnProperty('label') ? elementData.label : null,
                    currentElmTautan: elementData && elementData.hasOwnProperty('tautan') ? elementData.tautan : null,
                    currentElmNoUrut: elementData && elementData.hasOwnProperty('no_urut') ? elementData.no_urut : 1
                }
            })
            .then(function (data) {
                var elementType = data[0].fields[0].field[2].data;
                var required = (data[0].fields[0].field[3].data === 'true') ? true : false;
                var dataKolom = data[0].fields[0].field[6].data;
                var dataKolomId = data[0].fields[0].field[0].data;
                var label = data[0].fields[0].field[1].data;
                var tautan = data[0].fields[0].field[4].data;
                var noUrut = data[0].fields[0].field[5].data;

                if (mode === 'edit') {
                    elementData.type = elementType;
                    elementData.required = required;
                    elementData.data_kolom = dataKolom;
                    elementData.data_kolom_id = dataKolomId;
                    elementData.label = label;
                    elementData.tautan = tautan;
                    elementData.no_urut = noUrut;
                } else {
                    if (angular.isUndefined(form.fields[0].field)) {
                        form.fields[0].field = [];
                    }

                    form.fields[0].field.push({
                        id: null,
                        del: false,
                        data_kolom_id: dataKolomId,
                        data_kolom : dataKolom,
                        label: label,
                        type: elementType,
                        required: required,
                        data: '',
                        data_label: '',
                        upload_status: 'idle',
                        tautan: tautan,
                        no_urut: noUrut
                    });
                }

                switch (elementType) {
                    case 'photo':
                        form.has_photo = true;
                        break;
                }
            }, function () {
                $scope.status = 'element';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /**
         * Option for select type input
         * @param ev
         * @param elm
         */
        function showOption(ev, elm) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: optDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
            .then(function (data) {
                if (elm.options == null) {
                    elm.options = [{
                        id: data[0].fields[0].field[0].data,
                        name: data[0].fields[0].field[1].data
                    }];
                } else {
                    elm.options.push({
                        id: data[0].fields[0].field[0].data,
                        name: data[0].fields[0].field[1].data
                    });
                }
            }, function () {
                $scope.status = 'element';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /**
         * Source for autocomplete type input
         * @param ev
         * @param elm
         */
        function showSource(ev, elm) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: sourceDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    selectedKelompokDataId: elm.kelompok_data_id
                }
            })
            .then(function (data) {
                elm.kelompok_data_id = data[0].fields[0].field[0].data;

                // Get Configuration for combogrid by passing kelompok_data_id
                TemplateFormFactory.getCombogridConfig(elm.kelompok_data_id).then(function (res) {
                    var config = res.data.data;
                    if (config.hasOwnProperty('cg_fields')) {
                        elm.cg_fields = config.cg_fields;
                        elm.cg_value_col = config.cg_value_col;
                        elm.cg_label_col = config.cg_label_col;
                        elm.cg_url = config.cg_url;
                    }
                    return;
                });
            }, function () {
                $scope.status = 'source';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /**
         * Select formatted number configuration to use
         * @param ev
         * @param elm
         */
        function showNumbering(ev, elm) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: numberingDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    selectedNumberingId: elm.penomoran_id
                }
            })
            .then(function (data) {
                elm.penomoran_id = data[0].fields[0].field[0].data;
            }, function () {
                $scope.status = 'source';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        /**
         * Select button configuration to use
         * @param ev
         * @param elm
         */
        function showButton(ev, elm, locationType) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: buttonDialog,
                templateUrl: 'app/template-form-module/canvas.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    selectedButtonAction: elm && elm.hasOwnProperty('tombol_aksi') ? elm.tombol_aksi : null,
                    buttonLink: elm && elm.hasOwnProperty('tombol_tautan') ? elm.tombol_tautan : null,
                    type: (locationType) ? locationType : 'tabel'
                }
            })
            .then(function (data) {
                elm.tombol_aksi = data[0].fields[0].field[0].data;
                elm.tombol_tautan = data[0].fields[0].field[1].data;
            }, function () {
                $scope.status = 'source';
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function showTab(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog
                .show({
                    controller: tabDialog,
                    templateUrl: 'app/template-form-module/canvas.html',
                    parent: angular.element($document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen
                })
                .then(function (data) {
                    var noTab = false;
                    for (var i = 0; i < $scope.forms.length; i++) {
                        if ($scope.forms[i].ftype === 'tab') {
                            $scope.forms[i].ftab.push({
                                label: data[0].fields[0].field[0].data,
                                idx: $scope.forms[i].ftab.length + 1,
                                del: false
                            });
                            noTab = true;
                            break;
                        }
                    }
                    if (noTab === false) {
                        $scope.forms.push({
                            tabIdx: 100,
                            ftype: 'tab',
                            ftab: [{
                                label: data[0].fields[0].field[0].data,
                                idx: 1,
                                del: false
                            }]
                        });
                    }
                }, function () {
                    $scope.status = 'element';
                });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function showPrerenderedDialog(ev) {
            $mdDialog.show({
                controller: DialogController,
                contentElement: '#myDialog',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }

        function uploadFile(file, data) {
            data.upload_status = 'complete';
        }

        function saveForm() {
            var reqData = {
                nama_form: vm.template_form.nama_form,
                key_field: vm.template_form.key_field,
                otomatis_update: vm.template_form.otomatis_update,
                target_simpan: vm.template_form.target_simpan,
                service_eksternal_id: vm.template_form.service_eksternal_id,
                target_path: vm.template_form.target_path,
                canvas: $scope.forms
            };

            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'form/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.template-form');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** Autocomplete for Web Service Eksternal ***/
        $scope.selectedItemOtomatisUpdate = null;
        $scope.searchTextOtomatisUpdate = null;
        $scope.querySearchOtomatisUpdate = ServiceEksternalFactory.querySearchServiceEksternal;
        $scope.isDisabledOtomatisUpdate = false;
        $scope.noCacheOtomatisUpdate = false;
        $scope.selectedItemChangeOtomatisUpdate = selectedItemChangeOtomatisUpdate;

        //////////////////
        function selectedItemChangeOtomatisUpdate(item) {
            if (angular.isDefined(item)) {
                vm.template_form.service_eksternal_id = item.id;
            } else {
                vm.template_form.service_eksternal_id = null;
            }
        }
        /*** .Autocomplete for Web Service Eksternal ***/
    }
})();
