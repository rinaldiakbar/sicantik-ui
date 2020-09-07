(function() {
    'use strict';

    angular
        .module('maps-module', [])
        .constant('MAPS', {
            'GEOJSON': 'geojson',
            'TEMPLATEDATA': 'Template Data'
        })
        .factory('MapsFactory', MapsFactory);

    function MapsFactory($http, $log, EnvironmentConfig, AppFactory, $q) {
        return {
            getCSVData: getCSVData,
            getGeoJSONData: getGeoJSONData,
            getTemplateData: getTemplateData,
            getCenter: getCenter,
            getLayers: getLayers
        };

        function getCSVData() {
            var url = EnvironmentConfig.api + 'maps/sicantik';
            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(req)
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getGeoJSONData(source, mapsLayers) {
            var url = source.url;
            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(req)
                .success(function(data) {
                    mapsLayers[source['layer']] = {
                        name: source['layer_label'],
                        type: source['layer_type'],
                        data: data,
                        visible: true,
                        icon: {
                            icon: 'home',
                            markerColor: 'red',
                            prefix: 'fa'
                        }
                    };
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function getTemplateData(source, mapsMarkers) {
            var url = source.url;
            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(req)
                .success(function(data) {
                    var resData = data.data.maps;

                    for (var i = 0; i < resData.length; i++) {
                        var html = '<table class="popup-table">';

                        for (var key in resData[i]) {

                            if (key != 'lat' && key != 'long') {
                                html += '<tr>';
                                html += '<th>'+ key +'</th>';
                                html += '<td>' + resData[i][key] + '</td>';
                                html += '</tr>';
                            }
                        }
                        html += '</table>';

                        mapsMarkers.push({
                            lat: +resData[i]['lat'],
                            lng: +resData[i]['long'],
                            layer: source.layer,
                            message: html,
                            compileMessage: true
                        });
                    }
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function getCenter() {
            var url = EnvironmentConfig.api + 'maps/center';
            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(req)
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getLayers(module) {
            var url = EnvironmentConfig.api + 'maps/layers?'+'module='+module;
            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http(req)
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }
    }

})();
