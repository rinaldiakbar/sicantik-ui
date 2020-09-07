(function() {
    'use strict';

    angular
        .module('pengumuman-module')
        .controller('PengumumanViewController', PengumumanViewController);

    /* @ngInject */
    function PengumumanViewController($stateParams, $http, AppFactory,
        PengumumanFactory
    ) {
        var vm = this;
        var id = $stateParams.id;
        vm.pesan = {};

        PengumumanFactory.getPengumuman(id).then(function (res) {
            angular.copy(res.data.data, vm.pesan);
        });

        vm.cancelAction = PengumumanFactory.cancelAction;
        vm.downloadAttachment = downloadAttachment;

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
    }
})();
