(function() {
    'use strict';

    angular
        .module('faq-category-module')
        .controller('FaqCategoryViewController', FaqCategoryViewController);

    /* @ngInject */
    function FaqCategoryViewController($stateParams, FaqCategoryFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.faq_category = {};

        FaqCategoryFactory.getFaq(id).then(function (res) {
            angular.copy(res.data.data, vm.faq_category);
        });

        vm.cancelAction = FaqCategoryFactory.cancelAction;
    }
})();
