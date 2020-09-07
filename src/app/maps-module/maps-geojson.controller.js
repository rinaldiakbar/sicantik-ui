(function () {
    'use strict';

    angular
        .module('maps-module')
        .controller('MapsGeoController', MapsGeoController, ['$scope', '$http']);

    /* @ngInject */
    function MapsGeoController($scope, $http, $log) {
        angular.extend($scope, {
            world: {
                lat: 0,
                lng: 0,
                zoom: 3
            },
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    }
                },
                overlays:{}
            }
        });

        $http.get('http://cors-anywhere.herokuapp.com/http://angular-ui.github.io/ui-leaflet/examples/json/countries.geo.json')
            .success(function(data, status) {
                $log.info(status);
                angular.extend($scope.layers.overlays, {
                    countries: {
                        name:'World Country Boundaries',
                        type: 'geoJSONShape',
                        data: data,
                        visible: true,
                        layerOptions: {
                            style: {
                                color: '#00D',
                                fillColor: 'green',
                                weight: 2.0,
                                opacity: 0.6,
                                fillOpacity: 0.2
                            },
                            onEachFeature: function (feature, layer) {
                                layer.on({
                                    click: function() {
                                        layer.bindPopup(
                                            'Name: ' + feature.properties.name
                                        );
                                    }
                                });
                            }
                        }
                    }
                });
            });

        $http.get('http://cors-anywhere.herokuapp.com/http://angular-ui.github.io/ui-leaflet/examples/json/major_cities.json')
            .success(function(data, status) {
                $log.info(status);
                angular.extend($scope.layers.overlays, {
                    cities: {
                        name:'Major Cities (Awesome Markers)',
                        type: 'geoJSONAwesomeMarker',
                        data: data,
                        visible: true,
                        icon: {
                            icon: 'home',
                            markerColor: 'red',
                            prefix: 'fa'
                        },
                        layerOptions: {
                            onEachFeature: function (feature, layer) {
                                layer.on({
                                    click: function() {
                                        layer.bindPopup(
                                            'Name: ' + feature.properties.name
                                        );
                                    }
                                });
                            }
                        }
                    }
                });
            });
    }
})();
