(function() {
	'use strict';

	angular
		.module('pemohon-module')
        .controller('PemohonViewController', PemohonViewController);

	/* @ngInject */
    function PemohonViewController(
        $state, $scope, $stateParams, $mdDialog, $mdMedia, $log, $document,
		ElementConfig, PemohonFactory, PerusahaanFactory, PermohonanIzinFactory, IzinFactory
	) {
		var vm = this;
		vm.key_id = $stateParams.key_id;

		vm.pemohon = {};
		vm.cancelAction = PemohonFactory.cancelAction;
		vm.showFormAdd = showFormAdd;
		vm.showProcess = showProcess;
		vm.showPermohonanView = showPermohonanView;
		vm.showPerusahaanView = showPerusahaanView;
		vm.showIzinView = showIzinView;
		vm.showDokumenPemohonView = showDokumenPemohonView;
		vm.showDokumenPemohonAdd = showDokumenPemohonAdd;
		vm.showDokumen  = showDokumen;

		PemohonFactory.getPemohon(vm.key_id).then(function (res) {
			angular.copy(res.data.data, vm.pemohon);
			activatePermohonan();
			activatePerusahaan();
			activateIzin();
			activateDokumenPemohon();

			PermohonanIzinFactory.getGenderList().then(function (res) {
				vm.genderList = res.data.data.items;

				PermohonanIzinFactory.getJenisIdentitasList().then(function (res) {
                    vm.jenisIdentitasList = res.data.data.items;
				});
			});
		});

		function showDokumen(lokasi) {
			$log.info('Opening Dokumen Dialog');
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;

			$mdDialog.show({
				controller: PemohonDialogController,
				templateUrl: 'app/pemohon-module/pemohon-dialog.tmpl.html',
                parent: angular.element($document.body),
				clickOutsideToClose: false,
				fullscreen: useFullScreen,
                    locals: {
                        dokumen: lokasi
                    }
				});

			$scope.$watch(function () {
				return $mdMedia('xs') || $mdMedia('sm');
			}, function (wantsFullScreen) {
				$scope.customFullscreen = (wantsFullScreen === true);
			});
		}

		/////////////////
		function showFormAdd(keyId) {
			$state.go('triangular.admin-default.pemohon-permohonan-izin-add', {'key_id': keyId});
		}

		function showProcess(permohonanId) {
			var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
			$mdDialog.show({
				controller: TrackingDialogController,
				templateUrl: 'app/pemohon-module/tracking-dialog.tmpl.html',
                parent: angular.element($document.body),
				clickOutsideToClose: true,
				fullscreen: useFullScreen,
				locals: {
					permohonanIzinId: permohonanId
				}
			});

			$scope.$watch(function() {
				return $mdMedia('xs') || $mdMedia('sm');
			}, function(wantsFullScreen) {
				$scope.customFullscreen = (wantsFullScreen === true);
			});
		}

		function showPermohonanView(permohonanId) {
			$state.go(
				'triangular.admin-default.pemohon-permohonan-izin-detail', 
				{ 'key_id': vm.key_id, 'permohonan_id': permohonanId }
			);
		}

		function showPerusahaanView(perusahaanId) {
			$state.go(
				'triangular.admin-default.pemohon-perusahaan-detail', 
				{ 'key_id': vm.key_id, 'perusahaan_id': perusahaanId }
			);
		}

		function showIzinView(izinId) {
			$state.go(
				'triangular.admin-default.pemohon-izin-detail', 
				{ 'key_id': vm.key_id, 'izin_id': izinId }
			);
		}

		function showDokumenPemohonView(dokumenPemohonId) {
			$state.go(
				'triangular.admin-default.pemohon-dokumen-detail',
				{ 'key_id': vm.key_id, 'dokumen_pemohon_id': dokumenPemohonId }
			);
		}

		function showDokumenPemohonAdd() {
			$state.go(
				'triangular.admin-default.pemohon-dokumen-add',
				{ 'key_id': vm.key_id}
			);
		}

		
		/*** BEGIN - Permohonan Izin Table Grid ***/
		vm.queryPermohonan = {
			filter: '',
			limit: ElementConfig.gridRow,
			order: '-permohonanizin.id',
			page: 1,
			pemohon_id: vm.key_id
		};
		vm.filterPermohonan = {
			options: {
				debounce: 500
			}
		};
		vm.getDataPermohonan = getDataPermohonan;

		///////////
		function activatePermohonan() {
			var bookmark;
			$scope.$watch('vm.queryPermohonan.filter', function(newValue, oldValue) {
				if (!oldValue) {
					bookmark = vm.queryPermohonan.page;
				}

				if (newValue !== oldValue) {
					vm.queryPermohonan.page = 1;
				}

				if (!newValue) {
					vm.queryPermohonan.page = bookmark;
				}

				vm.getDataPermohonan();
			});

			$scope.$watch('vm.queryPermohonan.begin_date', function(newValue, oldValue) {
				if (!oldValue) {
					bookmark = vm.queryPermohonan.page;
				}

				if (newValue !== oldValue) {
					vm.queryPermohonan.page = 1;
				}

				if (!newValue) {
					vm.queryPermohonan.page = bookmark;
				}

				vm.getDataPermohonan();
			});

			$scope.$watch('vm.queryPermohonan.end_date', function(newValue, oldValue) {
				if (!oldValue) {
					bookmark = vm.queryPermohonan.page;
				}

				if (newValue !== oldValue) {
					vm.queryPermohonan.page = 1;
				}

				if (!newValue) {
					vm.queryPermohonan.page = bookmark;
				}

				vm.getDataPermohonan();
			});
		}

		function getDataPermohonan() {
			PermohonanIzinFactory.getPagedPermohonanIzin(vm.queryPermohonan).then(function(res) {
				vm.dataPermohonan = res.data.data;
			});
		}
		/*** END - Permohonan Izin Table Grid ***/

		
		/*** BEGIN - Perusahaan Table Grid ***/
		vm.queryPerusahaan = {
			filter: '',
			limit: ElementConfig.gridRow,
			order: '-perusahaan.id',
			page: 1,
			pemohon_id: vm.key_id
		};
		vm.filterPerusahaan = {
			options: {
				debounce: 500
			}
		};
		vm.getDataPerusahaan = getDataPerusahaan;

		///////////
		function activatePerusahaan() {
			var bookmark;
			$scope.$watch('vm.queryPerusahaan.filter', function(newValue, oldValue) {
				if (!oldValue) {
					bookmark = vm.queryPerusahaan.page;
				}

				if (newValue !== oldValue) {
					vm.queryPerusahaan.page = 1;
				}

				if (!newValue) {
					vm.queryPerusahaan.page = bookmark;
				}

				vm.getDataPerusahaan();
			});
		}

		function getDataPerusahaan() {
			PerusahaanFactory.getPagedPerusahaan(vm.queryPerusahaan).then(function(res) {
				vm.dataPerusahaan = res.data.data;
			});
		}
		/*** END - Perusahaan Table Grid ***/

		
		/*** BEGIN - Izin Table Grid ***/
		vm.queryIzin = {
			filter: '',
			limit: ElementConfig.gridRow,
			order: '-Izin.id',
			page: 1,
			pemohon_id: vm.key_id
		};
		vm.filterIzin = {
			options: {
				debounce: 500
			}
		};
		vm.getDataIzin = getDataIzin;

		///////////
		function activateIzin() {
			var bookmark;
			$scope.$watch('vm.queryIzin.filter', function(newValue, oldValue) {
				if (!oldValue) {
					bookmark = vm.queryIzin.page;
				}

				if (newValue !== oldValue) {
					vm.queryIzin.page = 1;
				}

				if (!newValue) {
					vm.queryIzin.page = bookmark;
				}

				vm.getDataIzin();
			});

			$scope.$watch('vm.queryIzin.begin_date', function(newValue, oldValue) {
				if (!oldValue) {
					bookmark = vm.queryIzin.page;
				}

				if (newValue !== oldValue) {
					vm.queryIzin.page = 1;
				}

				if (!newValue) {
					vm.queryIzin.page = bookmark;
				}

				vm.getDataIzin();
			});

			$scope.$watch('vm.queryIzin.end_date', function(newValue, oldValue) {
				if (!oldValue) {
					bookmark = vm.queryIzin.page;
				}

				if (newValue !== oldValue) {
					vm.queryIzin.page = 1;
				}

				if (!newValue) {
					vm.queryIzin.page = bookmark;
				}

				vm.getDataIzin();
			});
		}

		function getDataIzin() {
			IzinFactory.getPagedIzin(vm.queryIzin).then(function(res) {
				vm.dataIzin = res.data.data;
			});
		}
		/*** END - Perusahaan Table Grid ***/
		
		
		/*** BEGIN - Izin Table Grid ***/
		vm.queryDokumenPemohon = {
			filter: '',
			limit: ElementConfig.gridRow,
			order: '-dokumenPemohon.id',
			page: 1,
			pemohon_id: vm.key_id
		};
		vm.filterDokumenPemohon = {
			options: {
				debounce: 500
			}
		};
		vm.getDataDokumenPemohon = getDataDokumenPemohon;

		///////////
		function activateDokumenPemohon() {
			var bookmark;
			$scope.$watch('vm.queryDokumenPemohon.filter', function(newValue, oldValue) {
				if (!oldValue) {
					bookmark = vm.queryDokumenPemohon.page;
				}

				if (newValue !== oldValue) {
					vm.queryDokumenPemohon.page = 1;
				}

				if (!newValue) {
					vm.queryDokumenPemohon.page = bookmark;
				}

				vm.getDataDokumenPemohon();
			});
		}

		function getDataDokumenPemohon() {
			PemohonFactory.getPagedDokumenPemohon(vm.queryDokumenPemohon).then(function(res) {
				vm.dataDokumenPemohon = res.data.data;
			});
		}
		/*** END - Perusahaan Table Grid ***/
	}
})();

function PemohonDialogController($state, $scope, $mdDialog, $http, EnvironmentConfig, dokumen, PemohonFactory) {
	var type = dokumen.substr(-4);
    var filename = dokumen.split('dokumen_pemohon');

	$scope.tipe = type;
	$scope.url = EnvironmentConfig.api.replace('api/','') + 'files/dokumen_pemohon/'+filename[0];

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};
}

function TrackingDialogController($state, $scope, $mdDialog, $http, EnvironmentConfig, permohonanIzinId, MenuService, ProsesPengajuanFactory, FormFactory) {
	$scope.prosesPermohonan = [];

	ProsesPengajuanFactory.getProsesPermohonan(permohonanIzinId).then(function(res) {
		$scope.prosesPermohonan = res.data.data;
	}, function() {
		$mdDialog.cancel();
	});

	$scope.hide = function() {
		$mdDialog.hide();
	};
	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.openForm = function(tautan, formId) {
		$mdDialog.hide();
		MenuService.openLink(tautan, formId, permohonanIzinId);
	};

	// Download report generated by jasper
	$scope.downloadReport = function(reportId) {
		FormFactory.downloadReport(reportId, permohonanIzinId);
	};
}