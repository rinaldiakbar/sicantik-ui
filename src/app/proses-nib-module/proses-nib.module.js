(function() {
    'use strict';
    angular
        .module('proses-nib-module', [])
        .factory('ProsesNibFactory', ProsesNibFactory);

        function ProsesNibFactory($http, EnvironmentConfig, $state, AppFactory) {
            return {
                cancelAction: cancelAction,
                getProsesPermohonan: getProsesPermohonan,
                getPagedProsesNib: getPagedProsesNib
            };

            function cancelAction() {
                $state.go('triangular.admin-default.proses-pengajuan');
            }

            function getProsesPermohonan(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'permohonan_izin?q='+query.filter+
                        '&page='+query.page+ '&limit='+query.limit+'&order='+query.order+'&nib_id='+query.nib,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res){
                        //console.log(res);
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }

            function getPagedProsesNib(query) {
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'permohonan_izin/listNib?q='+query.filter+
                        '&page='+query.page+ '&limit='+query.limit+'&order='+query.order,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res){
                        //console.log(res);
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }
        }
})();