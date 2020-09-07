(function () {
    'use strict';

    angular
        .module('maps-module')
        .controller('MapsSicantikController', MapsSicantikController, ['$scope']);

    /* @ngInject */
    function MapsSicantikController($scope, MapsFactory) {
        var vm = this;

        angular.extend(vm, {
            center: {
                lat: -0.789275,
                lng: 113.92132700000002,
                zoom: 5
            },
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    }
                },
                overlays: {
                    sebaran: {
                        name: 'Penyebaran Pengguna SICANTIK',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'markercluster',
                        visible: true
                    }
                }
            },
            markers: []
        });

        MapsFactory.getCSVData()
            .then(function(res) {
                var lines = res.data.data.split('\n');

                angular.forEach(lines, function(val, key) {
                    if (key > 0) {
                        var fields = val.split(';');
                        var provinsi = fields[0];
                        var nama = fields[1];
                        var izin = fields[2];
                        var lat = parseFloat(fields[3]);
                        var lng = parseFloat(fields[4]);
                        var html = '<table class="popup-table">';
                        html += '<tr>';
                        html += '<th>Provinsi</th>';
                        html += '<td>' + provinsi + '</td>';
                        html += '</tr>';
                        html += '<tr>';
                        html += '<th>Nama</th>';
                        html += '<td>' + nama + '</td>';
                        html += '</tr>';
                        html += '<tr>';
                        html += '<th>Izin</th>';
                        html += '<td>' + izin + '</td>';
                        html += '</tr>';
                        html += '</table>';

                        vm.markers.push({
                            lat: lat,
                            lng: lng,
                            layer: 'sebaran',
                            message: html,
                            compileMessage: true
                        });
                    }
                });
            });

        /*
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
                            }
                        }
                    }
                });
            });
        */
    }
})();
