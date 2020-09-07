(function() {
    'use strict';

    angular
        .module('aksi-pegawai-module', [])

    .factory('AksiPegawaiFactory', AksiPegawaiFactory);

    function AksiPegawaiFactory($http, EnvironmentConfig, $state, AppFactory) {
        return {
            getListAksi: getListAksi
        };

        function getListAksi() {
            // GET the Navigation Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'caksipegawai/getAksiPegawaiList',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .success(function() {})
                .error(function(err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }
    }

})();