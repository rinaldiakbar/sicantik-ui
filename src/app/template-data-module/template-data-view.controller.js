(function() {
    'use strict';

    angular
        .module('template-data-module')
        .controller('TemplateDataViewController', TemplateDataViewController);

    /* @ngInject */
    function TemplateDataViewController($stateParams, TemplateDataFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.template_data = {};

        TemplateDataFactory.getTemplateData(id).then(function (res) {
           angular.copy(res.data.data, vm.template_data);
        });

        vm.cancelAction = TemplateDataFactory.cancelAction;
    }
})();
