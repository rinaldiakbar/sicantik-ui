(function() {
    'use strict';

    angular
        .module('faq-setting-module')
        .controller('FaqSettingEditController', FaqSettingEditController);

    /* @ngInject */
    function FaqSettingEditController(
        $http, $state, $log, $scope, $stateParams, $timeout, EnvironmentConfig,
        AppFactory, FaqSettingFactory, FaqCategoryFactory, Upload
    ) {
        var vm = this;
        var id = $stateParams.id;
        vm.faq = {
            id: id,
            pertanyaan: null,
            jawaban: null,
            faq_category_id: null,
            no_urut: null,
            is_active: true,
            file_lampiran: null
        };

        FaqSettingFactory.getFaq(id).then(function (res) {
            angular.copy(res.data.data, vm.faq);
            vm.faq.is_active = vm.faq.is_active === 1 ? true : false;
            vm.searchText = res.data.data.faq_category.nama;
            $log.info(vm.faq);
        });

        vm.updateAction = updateAction;
        vm.cancelAction = FaqSettingFactory.cancelAction;

        function updateAction() {
            var reqData = {
                pertanyaan: vm.faq.pertanyaan,
                jawaban: vm.faq.jawaban,
                faq_category_id: vm.faq.faq_category_id,
                no_urut: vm.faq.no_urut,
                file_lampiran: vm.faq.file_lampiran,
                is_active: vm.faq.is_active ? 1 : 0
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'faq/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.faq-setting');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /*** BEGIN - Autocomplete for FAQ Category ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = FaqCategoryFactory.querySearchCategory;
        vm.simulateQuery = false;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChange;

        //////////////////
        function selectedItemChange(item) {
            if (angular.isDefined(item)) {
                $log.info('Item changed to ' + item);
                vm.faq.faq_category_id = item.id;
            }
        }
        /*** END - Autocomplete for FAQ Category ***/

        vm.downloadFile = downloadFile;
        function downloadFile(downloadUrl) {
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

        /** BEGIN - File Upload **/
        vm.upload_status = 'idle'; // idle | uploading | complete
        vm.upload = upload;
        var fileList;

        function upload($files) {
            if ($files !== null && $files.length > 0) {
                fileList = $files;
                uploadStarted();
                // $timeout(uploadComplete, 4000);

                Upload.upload({
                    url: EnvironmentConfig.api + 'Faq/upload',
                    data: { file: fileList }
                }).then(function(resp) {
                    $log.info('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.message);
                    vm.faq.file_lampiran = resp.data.data.file_name;
                    uploadComplete();
                }, function(resp) {
                    $log.error('Error status: ' + resp.status);
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }

        function uploadStarted() {
            vm.upload_status = 'uploading';
        }

        function uploadComplete() {
            vm.upload_status = 'complete';
            var message = 'Berhasil upload ';
            for (var file in fileList) {
                message += fileList[file].name + ' ';
            }
            AppFactory.showToast(message);

            $timeout(uploadReset, 3000);
        }

        function uploadReset() {
            vm.upload_status = 'idle';
        }
        /** END - File Upload **/
    }
})();