(function() {
    'use strict';

    angular
        .module('form-assessment-module', [])
        .factory('FormAssessmentFactory', FormAssessmentFactory);

        function FormAssessmentFactory($http, $state, $log, EnvironmentConfig, AppFactory) {
            return {
                getPagedFormAssessment: getPagedFormAssessment,
                getFormAssessment: getFormAssessment,
                cancelAction: cancelAction,
                getAssessmentEvent: getAssessmentEvent,
            };

            function getPagedFormAssessment(query) {
                if(query.kategori){
                    query.kategori = query.kategori.replace("&", "%26");
                }
                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'FormAssessment?q='+query.filter+'&page='+query.page+'&limit='+query.limit+ '&status=' + query.status + '&kategori=' + query.kategori,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .error(function(err){
                        $log.error(err);
                    });
            }

            function getFormAssessment(id) {
                var getDataReq = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'FormAssessment/getFormAssessment/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(getDataReq)
                    .error(function(err){
                        $log.error(err);
                        $state.go('triangular.admin-default.form-assessment');
                    });
            }
            
            function cancelAction() {
                $state.go('triangular.admin-default.form-assessment');
            }
            
            function getAssessmentEvent(id) {
                var getDataReq = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'FormAssessment/getAssessmentPemohon/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(getDataReq)
                    .error(function(err){
                        $log.error(err);
                        $state.go('triangular.admin-default.form-assessment');
                    });
            }
        }
})();
