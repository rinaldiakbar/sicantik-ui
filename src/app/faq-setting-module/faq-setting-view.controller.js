(function() {
    'use strict';

    angular
        .module('faq-setting-module')
        .controller('FaqSettingViewController', FaqSettingViewController);

    /* @ngInject */
    function FaqSettingViewController(
        $http, $stateParams, AppFactory, FaqSettingFactory
    ) {
        var vm = this;
        var id = $stateParams.id;
        vm.faq = {};

        FaqSettingFactory.getFaq(id).then(function (res) {
           angular.copy(res.data.data, vm.faq);
        });

        vm.cancelAction = FaqSettingFactory.cancelAction;

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
    }
})();
