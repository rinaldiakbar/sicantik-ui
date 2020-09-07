(function() {
    'use strict';

    angular
        .module('faq-module')
        .controller('FaqViewController', FaqViewController);

    /* @ngInject */
    function FaqViewController(
        $http, $stateParams, FaqSettingFactory, MenuService, AppFactory
    ) {
        var vm = this;
        var id = $stateParams.id;
        vm.faq = {};
        vm.openLink = MenuService.openLink;

        FaqSettingFactory.getFaq(id).then(function (res) {
           angular.copy(res.data.data, vm.faq);
        });

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
