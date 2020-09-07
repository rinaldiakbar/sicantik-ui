(function () {
    'use strict';

    angular
      .module('simulasi-tarif-module')
      .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/simulasi-tarif-module');

        $stateProvider
          .state('triangular.admin-default.simulasi-tarif-add', {
              url: '/simulasi-tarif',
              templateUrl: 'app/simulasi-tarif-module/simulasi-tarif-add.tmpl.html',
              controller: 'SimulasiTarifAddController',
              controllerAs: 'vm'
          });
    }
})();
