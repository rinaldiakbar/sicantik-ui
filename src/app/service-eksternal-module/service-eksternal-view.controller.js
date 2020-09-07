(function() {
    'use strict';

    angular
        .module('service-eksternal-module')
        .controller('ServiceEksternalViewController', ServiceEksternalViewController);

    /* @ngInject */
    function ServiceEksternalViewController($scope, $stateParams, ServiceEksternalFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.serviceEksternal = {};

        ServiceEksternalFactory.getServiceEksternal(id).then(function(res) {
            angular.copy(res.data.data, vm.serviceEksternal);
        });

        vm.cancelAction = ServiceEksternalFactory.cancelAction;
    }
})();
