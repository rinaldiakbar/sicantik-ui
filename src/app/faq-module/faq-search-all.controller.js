(function() {
    'use strict';

    angular
        .module('faq-module')
        .controller('FaqSearchAllController', FaqSearchAllController);

    /* @ngInject */
    function FaqSearchAllController (
        $http, $state, $stateParams,  $scope, $timeout, $q, $mdDialog, $log,
        FaqFactory, EnvironmentConfig, ElementConfig, FaqCategoryFactory,
        MenuService
    ) {
        var vm = this;
        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.faq-detail', { 'id': id });
        };
        vm.openLink = MenuService.openLink;

        /*** BEGIN - Advance Table ***/
        vm.query = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-id',
            page: 1
        };
        vm.filter = {
            options: {
                debounce: 500
            }
        };
        vm.getData = getData;
        vm.removeFilter = removeFilter;
        activate();

        ///////////
        function activate() {
            var bookmark;
            $scope.$watch('vm.query.filter', function(newValue, oldValue) {
                if (!oldValue) {
                    bookmark = vm.query.page;
                }

                if (!newValue) {
                    vm.query.page = bookmark;
                }

                if (newValue !== oldValue) {
                    vm.getData();
                }
            });
        }

        function getData() {
            FaqFactory.getPagedFaq(vm.query).then(function(res) {
                vm.data = res.data.data;
            });
        }

        function removeFilter() {
            vm.filter.show = false;
            vm.query.filter = '';

            if (vm.filter.form.$dirty) {
                vm.filter.form.$setPristine();
            }
        }
        /*** END - Advance Table ***/
    }
})();