(function() {
    'use strict';

    angular
        .module('payroll-module')
        .controller('PayrollDetail', PayrollDetail);

    /* @ngInject */
    function PayrollDetail($http, $state, $stateParams, EnvironmentConfig, ElementConfig, $scope, $timeout, $q, $mdDialog, $mdToast, PayrollFactory, PayrollAreaFactory, PayrollProcessFactory) {
        var vm = this;
        
        /*** BEGIN - Advance Table ***/
        vm.query = {
				order: 'e.nama',
				limit: 10,
				page: 1,
                total: 0,
                download: false,
				filter: {
					search: $stateParams.id,
					dari: new Date(),
					sampai: new Date(),
					reset: false
				}
            };           
        

        vm.getData = getData;        
        
        vm.getData(false);             
        
        function getData(download) {
            vm.query.download = download;
            PayrollFactory.getPayrollDetail(vm.query).then(function(res) {
                if (download==false) {
                    vm.data = res.data.message;
                } else {
                    var a = document.createElement('a');
                    a.href = EnvironmentConfig.api.replace('api/','') + res.data.message.data.file;
                    a.target = '_blank';
                    a.download = 'payrollDetail.xls';
                    document.body.appendChild(a);
                    a.click();
                }
                                
            });
        }

        function getXls() {           
            $http({
				method : "POST",
				url : EnvironmentConfig.api +  "payroll/exportTimesheet",
				headers: { 'Content-Type': 'application/json' },
				data: vm.query
			}).then(function mySuccess(response) {
				vm.getData();
               
                var a = document.createElement('a');
				a.href = EnvironmentConfig.api.replace('api/','') + response.data.message.data.file;
				a.target = '_blank';
				a.download = 'timesheet.xlsx';
                document.body.appendChild(a);
            	a.click();
			}, function myError(response) {
				alert(response.statusText);
			});  
        }
        
       
    }
})();