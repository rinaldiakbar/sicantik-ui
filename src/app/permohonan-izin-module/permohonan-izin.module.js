(function () {
    'use strict';
    angular
        .module('permohonan-izin-module', [])
        .factory('PermohonanIzinFactory', PermohonanIzinFactory);

    function PermohonanIzinFactory(
        $http, $log, $state, $stateParams, $document, EnvironmentConfig, APP_CONFIG, AppFactory, _
    ) {
        return {
            getPagedPermohonanIzin: getPagedPermohonanIzin,
            getPermohonanIzin: getPermohonanIzin,
            deletePermohonanIzin: deletePermohonanIzin,
            deletePersyaratan: deletePersyaratan,
            cancelAction: cancelAction,
            getJenisPermohonanList: getJenisPermohonanList,
            querySearchJenisIzin: querySearchJenisIzin,
            getJenisIzinList: getJenisIzinListService,
            getGenderList: getGenderList,
            getJenisIdentitasList: getJenisIdentitasList,
            getTipePemohonList: getTipePemohonList,
            getJenisProyekList: getJenisProyekList,
            querySearchDesa: querySearchDesa,
            querySearchKecamatan: querySearchKecamatan,
            querySearchKabupaten: querySearchKabupaten,
            querySearchProvinsi: querySearchProvinsi,
            getPersyaratan: getPersyaratan,
            getNextStep: getNextStep,
            getParentWilayah: getParentWilayah,
            querySearchJenisUsaha: querySearchJenisUsaha,
            querySearchBidangUsaha: querySearchBidangUsaha,
            querySearchNoPermohonan: querySearchNoPermohonan,
            getNomorIzin: getNomorIzin,
            sanitizeData: sanitizeData,
            downloadDokumenPemohon: downloadDokumenPemohon,
            uploadDokumenPemohon: uploadDokumenPemohon,
            getPersyaratanByJenis: getPersyaratanByJenis
        };

        function getPagedPermohonanIzin(query) {
            var beginDate = angular.isDefined(query.begin_date) ? query.begin_date : null;
            var endDate = angular.isDefined(query.end_date) ? query.end_date : null;

            if (!_.isNull(beginDate)) {
                // convert to string
                beginDate = moment(beginDate).format(APP_CONFIG.datepickerFormat);
            }

            if (!_.isNull(endDate)) {
                // convert to string
                endDate = moment(endDate).format(APP_CONFIG.datepickerFormat);
            }

            var url = EnvironmentConfig.api + 'permohonan_izin?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit + '&begin_date=' + beginDate + '&end_date=' + endDate + '&order=' + query.order;

            if (angular.isDefined(query.pemohon_id)) {
                url += '&pemohon_id=' + query.pemohon_id;
            }

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getPermohonanIzin(id) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'permohonan_izin/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                    $state.go('triangular.admin-default.permohonan-izin');
                });
        }

        function deletePermohonanIzin(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'PermohonanIzin/delete/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function deletePersyaratan(persyaratanId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'Persyaratan/delete/' + persyaratanId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function (res) {
                    AppFactory.showToast(res.message);
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function cancelAction() {
            $state.go('triangular.admin-default.permohonan-izin');
        }

        function getJenisPermohonanList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'jenis_pengajuan/jenislist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getGenderList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pemohon/genderlist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getJenisIdentitasList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'pemohon/jenisidentitaslist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getTipePemohonList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'permohonan_izin/tipepemohonlist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getJenisProyekList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'PermohonanIzin/getjenisproyeklist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchJenisIzin(q, instansiId) {
            var query = {
                q: q,
                instansi_id: instansiId
            };

            return getJenisIzinListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getJenisIzinListService(query) {
            var url = EnvironmentConfig.api + 'JenisIzin/getlist?q=' + query.q;

            if (angular.isDefined(query.only_bertarif)) {
                url += '&only_bertarif=' + query.only_bertarif;
            }

            if (angular.isDefined(query.instansi_id)) {
                url += '&instansi_id=' + query.instansi_id;
            }

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchDesa(query, kecamatanId) {
            return getDesaListService(query, kecamatanId).then(function (res) {
                return res.data.data.items;
            });
        }

        function getDesaListService(query, kecamatanId) {
            var url = EnvironmentConfig.api + 'desa/list?q=' + query;

            if (angular.isDefined(kecamatanId) && !_.isNull(kecamatanId)) {
                url += '&kecamatan_id=' + kecamatanId;
            }

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchKecamatan(query, kabupatenId) {
            return getKecamatanListService(query, kabupatenId).then(function (res) {
                return res.data.data.items;
            });
        }

        function getKecamatanListService(query, kabupatenId) {
            var url = EnvironmentConfig.api + 'kecamatan/list?q=' + query;

            if (angular.isDefined(kabupatenId) && !_.isNull(kabupatenId)) {
                url += '&kabupaten_id=' + kabupatenId;
            }

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchKabupaten(query, provinsiId) {
            return getKabupatenListService(query, provinsiId).then(function (res) {
                return res.data.data.items;
            });
        }

        function getKabupatenListService(query, provinsiId) {
            var url = EnvironmentConfig.api + 'kabupaten/list?q=' + query;

            if (angular.isDefined(provinsiId) && !_.isNull(provinsiId)) {
                url += '&provinsi_id=' + provinsiId;
            }

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchProvinsi(query) {
            return getProvinsiListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getProvinsiListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'provinsi/list?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getPersyaratan(jenisIzinId) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'JenisIzin/getpersyaratan/' + jenisIzinId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        /**
         * Membuka proses selanjutnya dari sebuah Permohonan Izin
         * @param permohonanIzinId
         */
        function getNextStep(permohonanIzinId, prosesPermohonanId, redirectToNextStep) {
            var reqData = {
                'permohonan_id': permohonanIzinId,
                'proses_permohonan_id': prosesPermohonanId
            };
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'PermohonanIzin/getnextprocess',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function (res) {
                    var responseData = res.data;

                    // If we don't want to redirect
                    if (angular.isDefined(redirectToNextStep) && redirectToNextStep === false) {
                        return;
                    }

                    if (responseData.tautan !== '') {
                        // TODO Add Loading
                        // redirect ke Tautan Proses yang baru terbuka
                        $state.go('triangular.admin-default.' + responseData.tautan, {
                            'permohonan_id': permohonanIzinId,
                            'form_id': responseData.form_id,
                            'key_id': permohonanIzinId,
                            'proses_permohonan_id': responseData.id
                        });
                    }
                })
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getParentWilayah(desaId) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'Desa/getparentwilayah/' + desaId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchJenisUsaha(query) {
            return getJenisUsahaListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getJenisUsahaListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'JenisUsaha/getlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchBidangUsaha(query) {
            return getBidangUsahaListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getBidangUsahaListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'BidangUsaha/getlist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function querySearchNoPermohonan(query) {
            return getNoPermohonanListService(query).then(function (res) {
                return res.data.data.items;
            });
        }

        function getNoPermohonanListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'permohonan_izin/list?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function getNomorIzin(jenisIzinId, jenisPengajuan, instansiId, unitId) {
            var queryParams = {};
            var url = EnvironmentConfig.api + 'PermohonanIzin/getNomorIzin/' + jenisIzinId + '/' + jenisPengajuan;

            if (angular.isDefined(instansiId)) {
                queryParams.instansi_id = instansiId;
            }

            if (angular.isDefined(unitId)) {
                queryParams.unit_id = unitId;
            }

            url += AppFactory.httpBuildQuery(queryParams);

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function sanitizeData(data) {
            var newData = AppFactory.clone(data);
            var jenisUsahaIds = [];
            var bidangUsahaIds = [];

            if (newData.tipe_pemohon === 'PERUSAHAAN') {
                var objJenisUsaha = data.perusahaan.jenis_usaha;
                var objBidangUsaha = data.perusahaan.bidang_usaha;
                for (var i = 0; i < objJenisUsaha.length; i++) {
                    jenisUsahaIds.push(objJenisUsaha[i].id);
                }
                for (var j = 0; j < objBidangUsaha.length; j++) {
                    bidangUsahaIds.push(objBidangUsaha[j].id);
                }
                newData.perusahaan.jenis_usaha_ids = jenisUsahaIds;
                newData.perusahaan.bidang_usaha_ids = bidangUsahaIds;
            }

            newData.persyaratan.forEach(function (val, key) {
                newData.persyaratan[key].awal_berlaku = moment(val.awal_berlaku).format(APP_CONFIG.datepickerFormat);
                newData.persyaratan[key].akhir_berlaku = moment(val.akhir_berlaku).format(APP_CONFIG.datepickerFormat);
            });

            // Format date before posting
            if (newData.pemohon.tgl_lahir instanceof Date) {
                newData.pemohon.tgl_lahir = moment(newData.pemohon.tgl_lahir).format(APP_CONFIG.datepickerFormat);
            }

            return newData;
        }

        function downloadDokumenPemohon(filename) {
            AppFactory.downloadFile(filename, 'dokumen_pemohon');
        }

        function uploadDokumenPemohon(pemohonId, jenisDokumenId, permohonanId) {
            $state.go('triangular.admin-default.pemohon-dokumen-add-jenis', {
                'key_id': pemohonId,
                'jenis_dokumen_id': jenisDokumenId,
                'permohonan_id': permohonanId
            });
        }

        function getPersyaratanByJenis(permohonanId, jenisDokumenId) {
            // GET the original Data
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'Persyaratan/getbypermohonan/' + permohonanId + '/' + jenisDokumenId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function (err) {
                    $log.error(err);
                });
        }
    }

})();

function ListPemohonDialogController($scope, $mdDialog, $log, ElementConfig, PemohonFactory) {
    var vm = {};
    $scope.vm = vm;
    $scope.formData = [];

    /*** BEGIN - Advance Table ***/
    vm.query = {
        filter: '',
        limit: ElementConfig.dialogGridRow,
        order: '-id',
        page: 1
    };
    vm.filter = {
        options: {
            debounce: 500
        }
    };

    vm.getData = getData;
    vm.removeFilter = removeFilter;
    vm.pickData = pickData;
    activate();

    ///////////
    function activate() {
        var bookmark;
        $scope.$watch('vm.query.filter', function (newValue, oldValue) {
            if (!oldValue) {
                bookmark = vm.query.page;
            }

            if (newValue !== oldValue) {
                vm.query.page = 1;
            }

            if (!newValue) {
                vm.query.page = bookmark;
            }

            vm.getData();
        });
    }

    function getData() {
        PemohonFactory.getPagedPemohon(vm.query).then(function (res) {
            vm.data = res.data.data;
        });
    }

    function removeFilter() {
        vm.filter.show = false;
        vm.query.filter = '';

        if (vm.filter.form.$dirty) {
            vm.filter.form.$setPristine();
        }
    }

    function pickData(id) {
        $mdDialog.hide(id);
    }
    /*** END - Advance Table ***/

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}

function ListPerusahaanDialogController($scope, $mdDialog, ElementConfig,
    PerusahaanFactory, pemohonId
) {
    var vm = {};
    $scope.vm = vm;
    $scope.formData = [];

    /*** BEGIN - Advance Table ***/
    vm.query = {
        filter: '',
        limit: ElementConfig.dialogGridRow,
        order: '-id',
        page: 1
    };
    vm.filter = {
        options: {
            debounce: 500
        }
    };
    if (angular.isDefined(pemohonId)) {
        vm.query['pemohon_id'] = pemohonId;
    }

    vm.getData = getData;
    vm.removeFilter = removeFilter;
    vm.pickData = pickData;
    activate();

    ///////////
    function activate() {
        var bookmark;
        $scope.$watch('vm.query.filter', function (newValue, oldValue) {
            if (!oldValue) {
                bookmark = vm.query.page;
            }

            if (newValue !== oldValue) {
                vm.query.page = 1;
            }

            if (!newValue) {
                vm.query.page = bookmark;
            }

            vm.getData();
        });
    }

    function getData() {
        PerusahaanFactory.getPagedPerusahaan(vm.query).then(function (res) {
            vm.data = res.data.data;
        });
    }

    function removeFilter() {
        vm.filter.show = false;
        vm.query.filter = '';

        if (vm.filter.form.$dirty) {
            vm.filter.form.$setPristine();
        }
    }

    function pickData(id) {
        $mdDialog.hide(id);
    }
    /*** END - Advance Table ***/

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}