(function() {
    'use strict';

    angular
        .module('kamus-data-module')
        .controller('DatatabelViewController', DatatabelViewController);

    /* @ngInject */
    function DatatabelViewController($stateParams, KamusDataFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.datatabel = {};
        vm.data_kolom = [];
        vm.unit_datatabel = [];

        KamusDataFactory.getDatatabel(id).then(function (res) {
            angular.copy(res.data.data, vm.datatabel);
            vm.data_kolom = res.data.data.data_kolom;
            vm.unit_datatabel = res.data.data.unit_datatabel;
        });

        KamusDataFactory.getTipeKolomList().then(function(res) {
            vm.tipeKolomList = res.data.data.items;
        });

        vm.cancelAction = KamusDataFactory.cancelAction;
    }
})();
