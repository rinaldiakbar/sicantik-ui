(function () {
    'use strict';

    angular
        .module('perusahaan-module')
        .controller('PerusahaanNewStructureController', PerusahaanNewStructureController);

    /* @ngInject */
    function PerusahaanNewStructureController(
        $stateParams, AppFactory, PerusahaanFactory, $log, $mdDialog, $document, $state
    ) {
        var vm = this;
        var id = $stateParams.id;

        var nodeTemplate = function (data) {
            var template = '';

            if (!data.parent_id) {
                template += '<div class="company top">';
            } else {
                template += '<div class="company" ng-click="vm.PerusahaanDetail(' + data.id + ')">';
            }

            if (data.logo) {
                template +=
                    '<div class="logo">' +
                    '<img src="' + data.logo + '">' +
                    '</div>';
            }

            template += data.name + '</div>';
            return template;
        };

        PerusahaanFactory.getNewStructure(id).then(function (res) {
            var datasource = res.data.data;

            jQuery('#organization-chart').orgchart({
                'data': datasource[0],
                'nodeTitle': 'name',
                'nodeContent': 'id',
                'verticalLevel': 3, // align vertically from this level
                'visibleLevel': 4,
                'exportButton': true,
                'nodeTemplate': nodeTemplate,
                'toggleSiblingsResp': false,
                'createNode': function ($node, data) {
                    $node.on('click', function () {
                        getPerusahaanDetail(data); 
                    });

                    // Load PemegangSaham data
                    loadPemegangSaham($node, data.id);
                }
            });
        });

        function getPerusahaanDetail(nodeData) {
            $mdDialog.show({
                locals: {
                    data: nodeData
                },
                controller: PerusahaanStructureDialog,
                templateUrl: 'app/perusahaan-module/perusahaan-detail.dlg.html',
                parent: angular.element($document.body),
                clickOutsideToClose: true
            }).then(function () {
            }, function (err) {
                $log.error(err);
            });
        }

        function loadPemegangSaham($node, id) {
            PerusahaanFactory.getPemegangSaham(id).then(function (res) {
                if (res.data.data.length > 0) {
                    var list = '<ol class="shareholder">';
                    res.data.data.forEach(function (row) {
                        list += '<li>';
                        list += row.nama;
                        list += '<span class="percentage">[' + row.persentase + '%]<span>';
                        list += '</li>';
                    });
                    list += '</ol>';
                    $node.find('.company').append(list);
                }

                loadDirkom($node, id);
            });
        }

        function loadDirkom($node, id) {
            PerusahaanFactory.getDirkom(id).then(function (res) {
                $log.info(res.data.data);
                if (res.data.data.length > 0) {
                    var list = '<div class="section">';
                    list += '<div class="section-title">Dirkom<div>';
                    list += '<ol>';
                    res.data.data.forEach(function (row) {
                        list += '<li>';
                        list += row.nama + '-->' + row.c_pegawai.tgl_berakhir;
                        list += '</li>';
                    });
                    list += '</ol></div>';
                    $node.find('.company').append(list);
                }
            });
        }

        vm.showFormAdd = function () {
            $state.go('triangular.admin-default.perusahaan-add');
        };
    }

    function PerusahaanStructureDialog(
        $scope, $mdDialog, $http, $state, $window, $log, data,
        EnvironmentConfig, PerusahaanFactory, AppFactory, DashboardFactory
    ) {
        $scope.datadetail = [];

        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        // Get Detail Perusahaan
        PerusahaanFactory.getPerusahaan(data.id).then(function (res) {
            $scope.detail = res.data.data;
        }, function (err) {
            if (err.message) {
                AppFactory.showToast(err.message, 'error', err.errors);
            }
        });

        $scope.viewDetail = function (detail) {
            $state.go('triangular.admin-default.perusahaan-edit', {
                'id': detail.id
            });
            $mdDialog.hide();
        };

        // Chart Saham
        $scope.saham = {
            type: 'PieChart',
            data: {}
        };
        $scope.saham.options = {
            title: 'Saham',
            allowHtml: true,
            allowCollapse: true,
            'width': 200,
            'height': 200,
            'chartArea': {
                left: 0,
                top: 10,
                width: '100%'
            }
        };
        $scope.saham.data.cols = [
            {
                'label': 'Pemegang Saham',
                'pattern': '',
                'type': 'string'
            },
            {
                'label': 'Nilai',
                'pattern': '',
                'type': 'number'
            }
        ];
        PerusahaanFactory.getChartSaham(data.id).then(function (res) {
            $scope.saham.data.rows = res.data.data;
        }, function (err) {
            if (err.message) {
                AppFactory.showToast(err.message, 'error', err.errors);
            }
        });
        // .Chart Saham

        // Chart Performa
        $scope.performa = {
            type: 'LineChart',
            data: {}
        };
        $scope.performa.options = {
            title: 'Performa',
            allowHtml: true,
            allowCollapse: true,
            height: 200,
            legend: {
                position: 'top'
            }
        };
        PerusahaanFactory.getChartPerforma(data.id).then(function (res) {
            $scope.performa.data.cols = res.data.data.cols;
            $scope.performa.data.rows = res.data.data.rows;
            $scope.performa = DashboardFactory.convertToChartData($scope.performa);
        }, function (err) {
            if (err.message) {
                AppFactory.showToast(err.message, 'error', err.errors);
            }
        });
        // .Chart Performa 
    }
})();
