(function () {
    'use strict';

    angular
        .module('unit-module')
        .controller('UnitStructureController', UnitStructureController);

    /* @ngInject */
    function UnitStructureController($stateParams, AppFactory, UnitFactory) {
        var vm = this;
        var id = $stateParams.id;

        vm.structure = {
            type: "OrgChart",
            data: {}
        };
        vm.structure.options = {
            title: 'My Chart',
            allowHtml: true,
            allowCollapse: true
        }


        vm.structure.data.cols = [
            {"label": "Name", "pattern": "", "type": "string"},
            {"label": "Manager", "pattern": "", "type": "string"},
            {"label": "ToolTip", "pattern": "", "type": "string"}
        ];

        vm.view = "<img src='' height='100px' width='100px'></img></br>aaa</br>xxx";
        UnitFactory.getStructure(id).then(function (res) {
            vm.structure.data.rows = res.data.data;
            //alert(JSON.stringify(vm.structure.data));
        }, function (err) {
            if (err.message) {
                AppFactory.showToast(err.message, 'error', err.errors);
            }
        });


        vm.selected = function (item) {
            alert(JSON.stringify(vm.structure.data.rows[item.row].c[0].v));
        };
    }
})();