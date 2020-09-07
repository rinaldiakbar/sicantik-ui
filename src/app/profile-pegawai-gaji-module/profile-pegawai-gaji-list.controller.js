(function() {
    'use strict';

    angular
        .module('profile-pegawai-gaji-module')
        .controller('ProfilePegawaiGajiList', ProfilePegawaiGajiList);

    /* @ngInject */
    function ProfilePegawaiGajiList($http, $state, EnvironmentConfig, ElementConfig, $scope, 
        $timeout, $q, $mdDialog, $mdToast, ProfilePegawaiGajiFactory
    ) {
        var vm = this;

        vm.showFormEdit = function(id) {
            $state.go('triangular.admin-default.profile-pegawai-gaji-edit', { 'id': id });
        };

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
            ProfilePegawaiGajiFactory.getPegawaiGajiList(vm.query).then(function(res) {
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