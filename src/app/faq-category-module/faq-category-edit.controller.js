(function() {
    'use strict';

    angular
        .module('faq-category-module')
        .controller('FaqCategoryEditController', FaqCategoryEditController);

    /* @ngInject */
    function FaqCategoryEditController($http, $state, EnvironmentConfig, $stateParams, $log, $scope, AppFactory, FaqCategoryFactory) {
        var vm = this;
        var id = $stateParams.id;
        vm.faq_category = {
            id: id,
            nama: null,
            deskripsi: null,
            no_urut: null,
            is_active: true
        };

        FaqCategoryFactory.getFaq(id).then(function (res) {
            angular.copy(res.data.data, vm.faq_category);
            vm.faq_category.is_active = vm.faq_category.is_active === 1 ? true : false;
        });

        vm.updateAction = updateAction;
        vm.cancelAction = FaqCategoryFactory.cancelAction;

        function updateAction() {
            var reqData = {
                nama: vm.faq_category.nama,
                deskripsi: vm.faq_category.deskripsi,
                no_urut: vm.faq_category.no_urut,
                is_active: vm.faq_category.is_active ? 1 : 0
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'faq_category/' + id,
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
