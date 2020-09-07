(function() {
    'use strict';

    angular
        .module('rest-service-module')
        .controller('RestServiceViewController', RestServiceViewController);

    /* @ngInject */
    function RestServiceViewController($http, $state, EnvironmentConfig, $stateParams, RestServiceFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.restService = {};
        vm.api_url = EnvironmentConfig.api.replace('/api/', '/rest/');

        // GET the original Data
        RestServiceFactory.getRestService(id).then(function(res) {
            angular.copy(res.data.data, vm.restService);
            vm.restService.is_active = vm.restService.is_active === 1 ? true : false;
        });

        vm.cancelAction = RestServiceFactory.cancelAction;
    }
})();
