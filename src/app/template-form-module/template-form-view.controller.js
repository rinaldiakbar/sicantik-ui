(function () {
    'use strict';

    angular
        .module('template-form-module')
        .controller('TemplateFormViewController', TemplateFormViewController);

    /* @ngInject */
    function TemplateFormViewController($stateParams, TemplateFormFactory) {
        var vm = this;
        var id = $stateParams.form_id;
        vm.templateForm = {};

        TemplateFormFactory.getTemplateForm(id).then(function (res) {
            angular.copy(res.data.data, vm.templateForm);
        });

        vm.cancelAction = TemplateFormFactory.cancelAction;
    }
})();
