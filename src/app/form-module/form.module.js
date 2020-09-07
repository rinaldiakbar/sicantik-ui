(function () {
    'use strict';

    angular
        .module('form-module', [])
    .factory('FormFactory', FormFactory);

  function FormFactory(
        $http, $state, $stateParams, $mdMedia, $mdDialog, $log, AppFactory, PermohonanIzinFactory, MenuService,
        EnvironmentConfig, APP_CONFIG, _
  ) {
        return {
            getForm: getForm,
            downloadData: downloadData,
            downloadReport: downloadReport,
            downloadReportPesan: downloadReportPesan,
            getGridData: getGridData,
            cancelAction: cancelAction,
            cancelView: cancelView,
            saveData: saveData,
            saveAndNext: saveAndNext,
            deleteData: deleteData,
            viewFile: viewFile
        };

        function getForm(id, keyId, withRecord, formType, filters) {
            var params = {};
            var dataUrl = EnvironmentConfig.api + 'form/getform/' + id;

            if (!_.isNull(keyId)) {
                dataUrl = EnvironmentConfig.api + 'form/getform/' + id + '/' + keyId;
            }

            if (angular.isString(formType)) {
                params['form_type'] = formType;
            }

            if (typeof (withRecord) === 'boolean') {
                if (withRecord) {
                    params['with_record'] = 'T';
                } else {
                    params['with_record'] = 'F';
                }
            }

            params = _.merge(params, filters);
            dataUrl += AppFactory.httpBuildQuery(params);

            // GET the Data
            var getDataReq = {
                method: 'GET',
                url: dataUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function (err) {
                    if (err && err.hasOwnProperty('message')) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                    $state.go('triangular.admin-default.home');
                });
        }

        /**
         * Function to save the displayed data
         * @param {*} id 
         * @param {*} keyId 
         * @param {*} outputType 
         * @param {*} filters 
         */
        function downloadData(id, keyId, outputType, filters) {
            var params = {};
            var dataUrl = EnvironmentConfig.api + 'form/downloadData/' + id;

            if (!_.isNull(keyId)) {
                dataUrl = EnvironmentConfig.api + 'form/downloadData/' + id + '/' + keyId;
            }

            if (angular.isString(outputType)) {
                params['output_type'] = outputType;
            }

            params = _.merge(params, filters);
            dataUrl += AppFactory.httpBuildQuery(params);

            // Open the report downloadData directly
            // window.open(dataUrl);

            // Use ajax request to get the data
            var req = {
                method: 'GET',
                url: dataUrl,
                transformResponse: undefined, // do not parse as JSON
                responseType: 'arraybuffer'
            };

            $http(req)
                .success(function (res, status, headers) {
                    var parsedStream = AppFactory.parseFileStream(res, status, headers);
                    saveAs(parsedStream.blob, parsedStream.name);
                });
            return;
        }

        /**
         * Function to download report from TemplateData with type 'dokumen-cetak'
         */
        function downloadReport(reportId, keyId, filters) {
            var dataUrl = EnvironmentConfig.api + 'TemplateData/generateReport/' + reportId;
            var params = {
                'key_id': keyId
            };

            if (filters) {
                params = _.merge(params, filters);
            }
            dataUrl += AppFactory.httpBuildQuery(params);

            var req = {
                method: 'GET',
                url: dataUrl,
                transformResponse: undefined, // do not parse as JSON
                responseType: 'arraybuffer'
            };

            $http(req)
                .success(function (res, status, headers) {
                    var parsedStream = AppFactory.parseFileStream(res, status, headers);
                    saveAs(parsedStream.blob, parsedStream.name);
                })
                .error(function (data) {
                    var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                    var obj = angular.fromJson(decodedString);
                    if (obj.message) {
                        AppFactory.showToast(obj.message, 'error', obj.errors);
                    }
                });
            return;
        }

        function downloadReportPesan(paramReport) {
            var dataUrl = EnvironmentConfig.api + 'TemplateData/generateReport/' + paramReport;
            var req = {
                method: 'GET',
                url: dataUrl,
                transformResponse: undefined, // do not parse as JSON
                responseType: 'arraybuffer'
            };

            $http(req)
                .success(function (res, status, headers) {
                    var parsedStream = AppFactory.parseFileStream(res, status, headers);
                    saveAs(parsedStream.blob, parsedStream.name);
                })
                .error(function (data) {
                    var decodedString = String.fromCharCode.apply(null, new Uint8Array(data));
                    var obj = angular.fromJson(decodedString);
                    if (obj.message) {
                        AppFactory.showToast(obj.message, 'error', obj.errors);
                    }
                });
            return;
        }

        function getGridData(canvasId, query) {
            var queryString = AppFactory.httpBuildQuery(query);
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'form/getCanvasGridData/' + canvasId + queryString,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.proses-pengajuan');
        }

        function cancelView() {
            $state.go('triangular.admin-default.daftar-izin');
        }

        function saveData(formId, keyId, namaForm, canvasData, redirectLink, buttonId) {
            var data = sanitizeData(AppFactory.clone(canvasData));
            var apiUrl = EnvironmentConfig.api + 'form/saveform/' + formId;

            if (angular.isDefined(keyId) && !_.isNull(keyId)) {
                apiUrl += '/' + keyId;
            }

            var reqData = {
                id: null,
                nama_form: namaForm,
                canvas: data
            };

            if (buttonId) {
                reqData.button_id = buttonId;
            }

            var req = {
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                    if (angular.isUndefined(redirectLink)) {
                        $state.go('triangular.admin-default.proses-pengajuan');
                    } else {
                        MenuService.openLink(redirectLink);
                    }
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function saveAndNext(formId, keyId, namaForm, canvasData) {
            var data = sanitizeData(AppFactory.clone(canvasData));

            var reqData = {
                id: null,
                nama_form: namaForm,
                canvas: data
            };

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'form/saveform/' + formId + '/' + keyId,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);

                    var prosesPermohonanId = (angular.isDefined($stateParams.proses_permohonan_id)) ? $stateParams.proses_permohonan_id : null;
                    PermohonanIzinFactory.getNextStep(keyId, prosesPermohonanId);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function sanitizeData(canvasData) {
            // Parse the fields
            _.each(canvasData, function (canvas) {
                _.each(canvas.fields, function (record) {
                    _.each(record.field, function (field) {
                        // Convert date to string
                        if (field.data instanceof Date) {
                            field.data = moment(field.data).format(APP_CONFIG.datepickerFormat);
                        }
                    });
                });
            });

            return canvasData;
        }

        function deleteData(formId, datatabelId, keyId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'form/deleteData/' + formId + '/' + datatabelId + '/' + keyId,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function viewFile(filePath, scope, parent, folder) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && scope.customFullscreen;

            $mdDialog.show({
                controller: FileViewerDialogController,
                templateUrl: 'app/form-module/pdf-viewer-dialog.tmpl.html',
                parent: angular.element(parent),
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    filePath: filePath,
                    folder: folder
                }
            });

            scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                scope.customFullscreen = (wantsFullScreen === true);
            });
        }
    }
})();

function FileViewerDialogController(
    $state, $scope, $window, $mdDialog, AppFactory, EnvironmentConfig, filePath, folder
) {
    'use strict';

    $scope.url = AppFactory.getDownloadURL(filePath, folder);
    $scope.isPDF = filePath.endsWith('.pdf');

    $scope.downloadFile = function() {
        AppFactory.downloadFile(filePath, folder);
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}
