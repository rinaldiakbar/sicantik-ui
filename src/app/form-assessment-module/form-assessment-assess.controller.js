(function() {
    'use strict';

    angular
        .module('form-assessment-module')
        .controller('FormAssessmentAssess', FormAssessmentAssess);

    /* @ngInject */
    function FormAssessmentAssess($http, APP_CONFIG, $state, $stateParams, $mdDialog, $scope, $mdMedia, EnvironmentConfig, $log, $timeout, AppFactory, FormAssessmentFactory) {
        var vm = this;
        var id = $stateParams.id;

        vm.formAssessment = {description: null};
        vm.formAssessment.form_assessment_question = [];

        vm.createAction = createAction;
        vm.cancelAction = FormAssessmentFactory.cancelAction;
        vm.openOptionDialog = openOptionDialog;
        vm.addQuestion = addQuestion;
        vm.deleteQuestion = deleteQuestion;
        vm.dellOption = dellOption;

        FormAssessmentFactory.getAssessmentEvent(id).then(function (res) {
            vm.formAssessment = res.data.data;
        });

        function addQuestion() {
            vm.formAssessment.form_assessment_question.push({question_text: null, answer_type: 'options', del: 0});
            vm.formAssessment.form_assessment_question[vm.formAssessment.form_assessment_question.length - 1].answer_options = [];
        }

        function deleteQuestion(question){
            question.del = 1;
            var indeks = 0;
            var tmpQuestion = [];
            for(var i = 0; i < vm.formAssessment.form_assessment_question.length; ++i) {
                if (vm.formAssessment.form_assessment_question[i].sequence && vm.formAssessment.form_assessment_question[i].question_text) {
                    tmpQuestion[x] = vm.formAssessment.form_assessment_question[i];
                    x = x + 1;
                }
            }
            vm.formAssessment.form_assessment_question = tmpQuestion;
        }

        function dellOption(question){
            for(var i = 0; i < question.answer_options.length; ++i) {
                if (question.answer == question.answer_options[i].value) {
                    question.answer_options[i].del = 1;
                    if(!question.answer_options[i].value && !question.answer_options[i].label){
                        question.answer_options[i].value = "null deleted";
                        question.answer_options[i].label = "null deleted";
                    }
                }
            }
        }

        function openOptionDialog(question) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

            $mdDialog.show({
                controller: OptionDialogController,
                    templateUrl: 'app/form-assessment-module/option-dialog.tmpl.html',
                    parent: angular.element(document.body),
                    // targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: useFullScreen,
                    locals: {}
                })
                .then(function (data) {
                    // Get option Data
                    question.answer_options.push({value: data.value, label: data.label, del: 0});
                }, function () {
                    // $scope.status = 'You cancelled the dialog.';
                });

            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        function createAction() {
            var reqData = vm.formAssessment;

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'FormAssessment/add',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.form-assessment');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

    }
})();

function OptionDialogController($scope, $mdDialog, $log, ElementConfig) {
    $scope.option = {};

    $scope.hide = function () {
        $mdDialog.hide($scope.option);
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}