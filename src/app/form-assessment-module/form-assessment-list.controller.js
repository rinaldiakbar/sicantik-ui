(function() {
    'use strict';

    angular
        .module('form-assessment-module')
        .controller('FormAssessmentList', FormAssessmentList);

    /* @ngInject */
    function FormAssessmentList($http, $state, EnvironmentConfig, ElementConfig, $scope, $timeout, $q, $mdMedia, $mdDialog, FormAssessmentFactory, AppFactory) {
        var vm = this;
        vm.showFormAdd = function() {
            $state.go('triangular.admin-default.form-assessment-add');
        };
        vm.showFormEdit = function(id) {
            $state.go('triangular.admin-default.form-assessment-edit', { 'id': id });
        };
        vm.showFormView = function(id) {
            $state.go('triangular.admin-default.form-assessment-view', { 'id': id });
        };

        vm.confirmDelete = function(id) {
            var dialog = {
                title: 'Apakah anda yakin?',
                content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                ok: 'Ya',
                cancel: 'Tidak'
            };
            $mdDialog.show(
                $mdDialog.confirm()
                .title(dialog.title)
                .textContent(dialog.content)
                .ok(dialog.ok)
                .cancel(dialog.cancel)
            ).then(function(res) {
                FormAssessmentFactory.deleteAduan(id).then(function(res) {
                    getData();
                });
            });
        };

        /*** BEGIN - Advance Table ***/
        vm.query = {
            filter: '',
            limit: ElementConfig.gridRow,
            order: '-id',
            page: 1,
            status:'',
            kategori:''
        };
        vm.filter = {
            options: {
                debounce: 500
            }
        };

        vm.removeFilter = removeFilter;
        vm.prev = prev;
        vm.next = next;
        vm.max = 0;
        vm.prevVal = true;
        vm.nextVal = true;
        vm.getData = getData;
        getData();

        function prev() {
            var min = 1;
            var result = vm.query.page - min;
            vm.query.page = result;
            if(result == 1){
                vm.prevVal = true;
            }else{
                vm.prevVal = false;
            }
            if(result !== vm.max){
                vm.nextVal = false;
            }else{
                vm.nextVal = true;
            }
            getData();
        }

        function next() {
            var max = 1;
            var result = vm.query.page + 1;
            vm.query.page = result;
            if(result == vm.max){
                vm.nextVal = true;
            }else{
                vm.nextVal = false;
            }
            if(result != 1){
                vm.prevVal = false;
            }else{
                vm.prevVal = true;
            }
            getData();
        }

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
            FormAssessmentFactory.getPagedFormAssessment(vm.query).then(function(res) {
                vm.data = res.data.data;
                vm.max = Math.floor(vm.data.total_items / vm.data.limit);
                if(vm.data.total_items > vm.data.limit){
                    vm.nextVal = false;
                }
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

        vm.showEventActivation = function(id){
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: ActivationDialogController,
                templateUrl: 'app/form-assessment-module/activation-dialog.tmpl.html',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals: {
                    id: id
                }
            })
            .then(function (data) {
                // Get option Data
                var req = {
                    method: 'POST',
                    url: EnvironmentConfig.api + 'FormAssessment/activate',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: data
                };

                $http(req)
                    .success(function(res){
                        AppFactory.showToast(res.message);
                        $state.reload();
                    })
                    .error(function(err){
                        AppFactory.showToast(err.message, 'error', err.errors);
                    });
            });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        vm.stopEvent = function(id) {
            var req = {
                    method: 'POST',
                    url: EnvironmentConfig.api + 'FormAssessment/stopEvent',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    data: {
                        'id': id,
                        'status': 'tidak aktif'
                    }
                };

            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.reload();
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();

function ActivationDialogController($scope, $mdDialog, $log, ElementConfig, id) {
    $scope.event = {};
    $scope.event.form_assessment_id = id;
    $scope.event.status = 'AKTIF';
    $scope.event.assesor_type = 'pemohon';
    $scope.event.publish_begin = new Date(new Date().getFullYear(), 0, 1);
    $scope.event.publish_end = new Date(new Date().getFullYear(), 11, 31);

    $scope.hide = function () {
        $mdDialog.hide($scope.event);
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
