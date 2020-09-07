(function () {
  'use strict';

  angular
    .module('signature-module')
    .config(moduleConfig);

  /* @ngInject */
  function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
    $translatePartialLoaderProvider.addPart('app/signature-module');

    $stateProvider
      .state('triangular.admin-default.signature-report', {
        url: '/signature/report/:proses_permohonan_id/:template_data_id',
        templateUrl: 'app/signature-module/signature-report.tmpl.html',
        // set the controller to load for this page
        controller: 'SignatureReport',
        controllerAs: 'vm'
      })
    ;
  }
})();
