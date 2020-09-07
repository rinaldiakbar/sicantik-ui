(function() {
    'use strict';

    angular
        .module('maps-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider, uiGmapGoogleMapApiProvider) {
        $translatePartialLoaderProvider.addPart('app/maps-module');

        $stateProvider
        .state('triangular.admin-default.maps-fullwidth', {
            url: '/maps/fullwidth',
            templateUrl: 'app/maps-module/maps-fullwidth.tmpl.html',
            controller: 'MapController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.maps-geojson', {
            url: '/maps/geojson',
            templateUrl: 'app/maps-module/maps-geojson.tmpl.html',
            controller: 'MapsGeoController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.maps-sicantik', {
            url: '/maps/sicantik',
            templateUrl: 'app/maps-module/maps-sicantik.tmpl.html',
            controller: 'MapsSicantikController',
            controllerAs: 'vm'
        })
        .state('triangular.admin-default.maps-view', {
            url: '/maps/view',
            templateUrl: 'app/maps-module/maps-view.tmpl.html',
            controller: 'MapsViewController',
            controllerAs: 'vm'
        });

        uiGmapGoogleMapApiProvider.configure({
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    }
})();
