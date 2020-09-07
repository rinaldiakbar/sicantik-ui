(function() {
    'use strict';

    angular
        .module('faq-category-module')
        .controller('FaqCategoryAddController', FaqCategoryAddController);

    /* @ngInject */
    function FaqCategoryAddController($http, $state, EnvironmentConfig, $log, AppFactory, FaqCategoryFactory) {
        var vm = this;
        vm.faq_category = {
            nama: null,
            deskripsi: null,
            no_urut: null,
            is_active: true
        };

        vm.createAction = createAction;
        vm.cancelAction =  FaqCategoryFactory.cancelAction;

        function createAction() {
            var reqData = AppFactory.clone(vm.faq_category);
            reqData.is_active = reqData.is_active ? 1 : 0;

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'faq_category',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.faq-category');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
