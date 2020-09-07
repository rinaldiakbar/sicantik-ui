(function() {
    'use strict';

    angular
        .module('faq-module')
        .controller('FaqListController', FaqListController);

    /* @ngInject */
    function FaqListController(
        $http, $state, $log, $scope, $timeout, $q, $mdDialog,
        FaqFactory, EnvironmentConfig, ElementConfig, FaqCategoryFactory,
        MenuService
    ) {
        var vm = this;

        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.faq-view', { 'id': id });
        };

        /*** BEGIN - Advance Table ***/
        vm.query = {
            filter: '',
            page: 1,
            is_active: 'T'
        };
        vm.getData = getData;
        vm.openLink = MenuService.openLink;
        activate();

        function activate() {
            $scope.$watch('vm.query.filter', function(newValue, oldValue) {
                if (newValue === '' || newValue !== oldValue) {
                    vm.getData();
                }
            });
        }

        function getData() {
            FaqCategoryFactory.getPagedFaq(vm.query, false).then(function(res) {
                vm.data = res.data.data;
            });
        }
        /*** END - Advance Table ***/
    }
})();