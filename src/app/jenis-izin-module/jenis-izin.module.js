(function () {
    'use strict';
    angular
        .module('jenis-izin-module', [])
        .factory('JenisIzinFactory', JenisIzinFactory);

    function JenisIzinFactory($http, $log, $state, EnvironmentConfig, AppFactory) {
        return {
            getPagedJenisIzin: getPagedJenisIzin,
            getJenisIzin: getJenisIzin,
            deleteJenisIzin: deleteJenisIzin,
            deleteJenisPengajuan: deleteJenisPengajuan,
            cancelAction: cancelAction,
            querySearchAlurProses: querySearchAlurProses,
            getAlurProsesListService: getAlurProsesListService,
            querySearchUnit: querySearchUnit,
            querySearchJenisIzin: querySearchJenisIzin,
            deleteUnitTerkait: deleteUnitTerkait,
            deleteDokumenPendukung: deleteDokumenPendukung,
            deleteIzinParalel: deleteIzinParalel,
            getListStatusDokumen: getListStatusDokumen,
            getJenisPengajuanList: getJenisPengajuanList,
            getSatuanList: getSatuanList,
            copyJenisIzin: copyJenisIzin
        };

        function getPagedJenisIzin(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_izin?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getJenisIzin(id) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_izin/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function (err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.jenis-izin');
                });
        }

        function getJenisPengajuanList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_pengajuan/jenislist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getSatuanList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_pengajuan/satuanlist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function querySearchAlurProses(query) {
            return getAlurProsesListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getAlurProsesListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'alur_proses/list?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function deleteJenisIzin(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'jenis_izin/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function querySearchUnit(query) {
            return getUnitListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getUnitListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'unit/unitlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function querySearchJenisIzin(query, instansiId) {
            return getJenisIzinListService(query, instansiId).then(function (res) {
                return res.data.data.items;
            });
        }

        function getJenisIzinListService(query, instansiId) {
            var params = {
                'q': query
            };

            if (angular.isDefined(instansiId)) {
                params['instansi_id'] = instansiId;
            }

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'JenisIzin/getlist' + AppFactory.httpBuildQuery(params),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function deleteJenisPengajuan(jenisPengajuanId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'JenisPengajuan/delete/' + jenisPengajuanId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    $log.error(err);
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function deleteUnitTerkait(unitTerkaitId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'UnitTerkait/delete/' + unitTerkaitId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    $log.error(err);
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function deleteDokumenPendukung(dokumenPendukungId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'DokumenPendukung/delete/' + dokumenPendukungId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    $log.error(err);
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function deleteIzinParalel(izinParalelId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'IzinParalel/delete/' + izinParalelId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    $log.error(err);
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.jenis-izin');
        }

        function getListStatusDokumen() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'dokumen_pendukung/statuslist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .error(function (err) {
                    $log.error(err);
                });
        }

        function copyJenisIzin(id) {
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'JenisIzin/copy/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();

function OverrideAlurDialogController($scope, $mdDialog, _, alurProsesData, AlurProsesFactory, jenisPengajuanId) {
    var vm = $scope;
    $scope.alur_proses = alurProsesData;

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        $mdDialog.hide($scope.alur_proses);
    };

    AlurProsesFactory.getTautanList().then(function (res) {
        $scope.tautanList = res.data.data.items;
    });

    // Default all override row to be hidden
    $scope.isShowingOverrideForm = [];
    $scope.hideAllRow = false;
    angular.forEach($scope.alur_proses.daftar_proses, function (value, key) {
        $scope.isShowingOverrideForm[key] = false;
    });

    // Display Override Row
    $scope.openOverrideForm = function (index) {
        // If the object doesn't exists, create one
        if (_.isNull($scope.alur_proses.daftar_proses[index].jenis_izin_prose)) {
            $scope.alur_proses.daftar_proses[index].jenis_izin_prose = {
                'daftar_proses_id': $scope.alur_proses.daftar_proses[index].id,
                'jenis_pengajuan_id': jenisPengajuanId,
                'tautan': $scope.alur_proses.daftar_proses[index].tautan,
                'form_id': $scope.alur_proses.daftar_proses[index].form_id,
                'form': {
                    'nama_form': !_.isNull($scope.alur_proses.daftar_proses[index].form) ? $scope.alur_proses.daftar_proses[index].form.nama_form : null
                },
                'template_data_id': $scope.alur_proses.daftar_proses[index].template_data_id,
                'template_data': {
                    'keterangan': !_.isNull($scope.alur_proses.daftar_proses[index].template_data) ? $scope.alur_proses.daftar_proses[index].template_data.keterangan : null
                }
            };
        }
        $scope.hideAllRow = true;
        $scope.isShowingOverrideForm[index] = true;
    };

    // Hide Override Row
    $scope.closeOverrideForm = function (index) {
        $scope.hideAllRow = false;
        $scope.isShowingOverrideForm[index] = false;
    };

    /** BEGIN - Autocomplete **/
    vm.searchTextForm = [];
    vm.querySearchForm = AlurProsesFactory.querySearchForm;
    vm.selectedItemChangeForm = selectedItemChangeForm;

    function initFormAutocomplete() {
        vm.alur_proses.daftar_proses.forEach(function (daftar, index) {
            if (!_.isNull(daftar.jenis_izin_prose)) {
                if (!_.isNull(daftar.jenis_izin_prose.form) && angular.isDefined(daftar.jenis_izin_prose.form)) {
                    vm.searchTextForm[index] = daftar.jenis_izin_prose.form.nama_form;
                }
            }
        });
    }

    function selectedItemChangeForm(item, index) {
        if (angular.isDefined(item)) {
            vm.alur_proses.daftar_proses[index].jenis_izin_prose.form_id = item.id;
            vm.alur_proses.daftar_proses[index].jenis_izin_prose.form.nama_form = item.nama_form;

            if (_.isNull(vm.alur_proses.daftar_proses[index].jenis_izin_prose.form)) {
                vm.alur_proses.daftar_proses[index].jenis_izin_prose.form = {};
            }
        }
    }

    vm.searchTextTemplateData = [];
    vm.querySearchTemplateData = AlurProsesFactory.querySearchTemplateData;
    vm.selectedItemChangeTemplateData = selectedItemChangeTemplateData;

    function initTemplateDataAutocomplete() {
        vm.alur_proses.daftar_proses.forEach(function (daftar, index) {
            if (!_.isNull(daftar.jenis_izin_prose)) {
                if (!_.isNull(daftar.jenis_izin_prose.template_data) && angular.isDefined(daftar.jenis_izin_prose.template_data)) {
                    vm.searchTextTemplateData[index] = daftar.jenis_izin_prose.template_data.keterangan;
                }
            }
        });
    }

    function selectedItemChangeTemplateData(item, index) {
        if (angular.isDefined(item)) {
            vm.alur_proses.daftar_proses[index].jenis_izin_prose.template_data_id = item.id;
            vm.alur_proses.daftar_proses[index].jenis_izin_prose.template_data.keterangan = item.keterangan;

            if (_.isNull(vm.alur_proses.daftar_proses[index].jenis_izin_prose.template_data)) {
                vm.alur_proses.daftar_proses[index].jenis_izin_prose.template_data = {};
            }
        }
    }

    initFormAutocomplete();
    initTemplateDataAutocomplete();
    /** END - Autocomplete **/
}