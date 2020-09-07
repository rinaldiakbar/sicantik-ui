(function () {
    'use strict';

    angular
        .module('retribusi-module')
        .config(moduleConfig);

  /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider) {
        $translatePartialLoaderProvider.addPart('app/retribusi-module');

        $stateProvider
          .state('triangular.admin-default.retribusi-add', {
              url: '/retribusi/add/:permohonan_id/:proses_permohonan_id',
              templateUrl: 'app/retribusi-module/retribusi-add.tmpl.html',
              controller: 'RetribusiAddController',
              controllerAs: 'vm'
          });
    }
})();
