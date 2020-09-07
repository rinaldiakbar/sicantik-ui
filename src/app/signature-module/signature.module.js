(function() {
    'use strict';
    angular
        .module('signature-module', [
        ])
        .factory('SignatureFactory', SignatureFactory);

        function SignatureFactory($http, EnvironmentConfig, $mdToast, $state, AppFactory, ProsesPengajuanFactory) {
            return {
                getProsesPermohonan: getProsesPermohonan
            };

            function getProsesPermohonan(prosesPermohonanId)
            {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'proses_permohonan/' + prosesPermohonanId,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function (res) {
                    })
                    .error(function (err) {
                        ProsesPengajuanFactory.cancelAction();
                    });
            }
        }
})();