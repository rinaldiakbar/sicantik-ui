(function() {
    'use strict';

    angular
        .module('faq-module')
        .controller('FaqSearchController', FaqSearchController);

    /* @ngInject */
    function FaqSearchController(
        $http, $state, $stateParams,  $scope, $timeout, $q, $mdDialog, $log,
        FaqFactory, EnvironmentConfig, ElementConfig, FaqCategoryFactory,
        MenuService
    ) {
        var vm = this;
        var categoryId = $stateParams.key_id;

        FaqCategoryFactory.getFaq(categoryId).then(function(res) {
            vm.category = res.data.data;
        }).catch(function(err) {
            $log.error(err);
            $state.go('triangular.admin-default.faq');
        });
    
        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.faq-view', { 'id': id });
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
            FaqFactory.getPagedFaq(vm.query, categoryId).then(function(res) {
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