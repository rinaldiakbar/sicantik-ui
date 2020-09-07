(function() {
    'use strict';

    angular
        .module('bidang-usaha-module')
        .controller('BidangUsahaViewController', BidangUsahaViewController);

    /* @ngInject */
    function BidangUsahaViewController($scope, $stateParams, BidangUsahaFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.bidangusaha = {};

        BidangUsahaFactory.getBidangUsaha(id).then(function (res) {
            angular.copy(res.data.data, vm.bidangusaha);
        });

        vm.cancelAction = BidangUsahaFactory.cancelAction;
    }
})();
