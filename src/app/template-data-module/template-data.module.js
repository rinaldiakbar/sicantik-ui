(function () {
    'use strict';

    angular
        .module('template-data-module', [])

        .factory('TemplateDataFactory', TemplateDataFactory);

    function TemplateDataFactory($http, $log, $state, EnvironmentConfig, AppFactory) {
        return {
            getPagedTemplateData: getPagedTemplateData,
            getTemplateData: getTemplateData,
            deleteTemplateData: deleteTemplateData,
            cancelAction: cancelAction,
            getTipeKeluaranList: getTipeKeluaranList,
            getJenisSumberList: getJenisSumberList,
            getTipeKelompokList: getTipeKelompokList,
            getTipeJoinList: getTipeJoinList,
            getTipeKondisiList: getTipeKondisiList,
            getTipeRelasiList: getTipeRelasiList,
            deleteKelompokData: deleteKelompokData,
            copyTemplateData: copyTemplateData,
            getKelompokData: getKelompokData,
            querySearchKelompokData: querySearchKelompokData,
            getPagedTemplateDoc: getPagedTemplateDoc
        };

        function getPagedTemplateData(query) {
            var kecamatanId = angular.isDefined(query.kecamatan_id) ? query.kecamatan_id : '';

            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'template_data?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit + '&kecamatan_id=' + kecamatanId,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getTemplateData(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'template_data/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                    $state.go('triangular.admin-default.template-data');
                });
        }

        function deleteTemplateData(id) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'template_data/' + id,
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

        function cancelAction() {
            $state.go('triangular.admin-default.template-data');
        }

        function getTipeKeluaranList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'template_data/tipekeluaranlist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getJenisSumberList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'kelompok_data/jenissumberlist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getTipeKelompokList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'kelompok_data/tipekelompoklist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.log(err);
                });
        }

        function getTipeJoinList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'KelompokTabel/gettipejoinlist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getTipeKondisiList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'KelompokKondisi/gettipekondisilist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getTipeRelasiList() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'KelompokKondisi/gettiperelasilist',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                });
        }

        function deleteKelompokData(kelompokDataId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'KelompokData/delete/' + kelompokDataId,
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

        function copyTemplateData(id) {
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'TemplateData/copy/' + id,
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

        function getKelompokData(id) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'kelompok_data/' + id,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                });
        }

        function querySearchKelompokData(query) {
            return getKelompokDataListService(query).then(function (res) {
                var mappedList = res.data.data.items.map(function (value) {
                    return {
                        'id': value.id,
                        'label': value.template_data.keterangan + ' - ' + value.label_kelompok
                    };
                });
                return mappedList;
            });
        }

        function getKelompokDataListService(query) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'KelompokData/getWebServicelist?q=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req)
                .success(function () {})
                .error(function (err) {
                    $log.error(err);
                });
        }

        function getPagedTemplateDoc(modul) {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'template-data/getReportByModule/' + modul,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(req).error(function(err) {
                $log.error(err);
            });
        }        
    }
})();

function SqlDialogController($scope, $mdDialog, sqlQuery) {
    $scope.formData = {};
    $scope.formData.sql = sqlQuery;

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        $mdDialog.hide($scope.formData);
    };
}

function WizardDialogController($scope, $mdDialog, grupData, TemplateDataFactory) {
    $scope.formData = grupData;

    if (angular.isUndefined(grupData.kelompok_tabel)) {
        $scope.formData.kelompok_tabel = [];
    }
    if (angular.isUndefined(grupData.kelompok_kolom)) {
        $scope.formData.kelompok_kolom = [];
    }
    if (angular.isUndefined(grupData.kelompok_kondisi)) {
        $scope.formData.kelompok_kondisi = [];
    }

    $scope.addKelompokTabel = function () {
        $scope.formData.kelompok_tabel.push({
            'nama_tabel': '',
            'tipe_join': ''
        });
    };

    $scope.removeKelompokTabel = function (index) {
        if (angular.isDefined($scope.formData.kelompok_tabel[index].id)) {
            var dialog = {
                title: 'Apakah anda yakin?',
                content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                ok: 'Ya',
                cancel: 'Tidak'
            };

            $mdDialog.show(
                $mdDialog.confirm()
                .title(dialog.title)
                .textContent(dialog.content)
                .ok(dialog.ok)
                .cancel(dialog.cancel)
            ).then(function () {
                $scope.formData.kelompok_tabel.splice(index, 1);
            });
        } else {
            $scope.formData.kelompok_tabel.splice(index, 1);
        }
    };

    $scope.addKelompokKolom = function () {
        $scope.formData.kelompok_kolom.push({
            'nama_tabel': '',
            'nama_kolom': '',
            'alias_kolom': ''
        });
    };

    $scope.removeKelompokKolom = function (index) {
        if (angular.isDefined($scope.formData.kelompok_kolom[index].id)) {
            // var kelompokDataId = $scope.formData.kelompok_kolom[index].id;
            var dialog = {
                title: 'Apakah anda yakin?',
                content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                ok: 'Ya',
                cancel: 'Tidak'
            };

            $mdDialog.show(
                $mdDialog.confirm()
                .title(dialog.title)
                .textContent(dialog.content)
                .ok(dialog.ok)
                .cancel(dialog.cancel)
            ).then(function () {
                $scope.formData.kelompok_kolom.splice(index, 1);
            });

        } else {
            $scope.formData.kelompok_kolom.splice(index, 1);
        }
    };

    $scope.addKelompokKondisi = function () {
        $scope.formData.kelompok_kondisi.push({
            'nama_tabel_1': '',
            'nama_kolom_1': '',
            'tipe_kondisi': '',
            'nama_tabel_2': '',
            'nama_kolom_2': '',
            'tipe_relasi': ''
        });
    };
    $scope.removeKelompokKondisi = function (index) {
        if (angular.isDefined($scope.formData.kelompok_kondisi[index].id)) {
            var dialog = {
                title: 'Apakah anda yakin?',
                content: 'Data yang sudah dihapus tidak dapat dikembalikan!',
                ok: 'Ya',
                cancel: 'Tidak'
            };

            $mdDialog.show(
                $mdDialog.confirm()
                .title(dialog.title)
                .textContent(dialog.content)
                .ok(dialog.ok)
                .cancel(dialog.cancel)
            ).then(function () {
                $scope.formData.kelompok_kondisi.splice(index, 1);
            });

        } else {
            $scope.formData.kelompok_kondisi.splice(index, 1);
        }
    };

    TemplateDataFactory.getTipeJoinList().then(function (res) {
        $scope.tipeJoinList = res.data.data.items;
    });

    TemplateDataFactory.getTipeKondisiList().then(function (res) {
        $scope.tipeKondisiList = res.data.data.items;
    });

    TemplateDataFactory.getTipeRelasiList().then(function (res) {
        $scope.tipeRelasiList = res.data.data.items;
    });

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        $mdDialog.hide($scope.formData);
    };
}

function TestQueryDialogController(
    $scope, $mdDialog, $http, EnvironmentConfig, AppFactory, sql, user_id,
    peran_id, pegawai_id, unit_id, instansi_id
) {
    $scope.formData = {};
    $scope.formData.strJson = null;
    $scope.formData.key_id = null;
    $scope.formData.user_id = user_id;
    $scope.formData.user_id_enabled = _.isNull(user_id);
    $scope.formData.peran_id = peran_id;
    $scope.formData.peran_id_enabled = _.isNull(peran_id);
    $scope.formData.pegawai_id = pegawai_id;
    $scope.formData.pegawai_id_enabled = _.isNull(pegawai_id);
    $scope.formData.unit_id = unit_id;
    $scope.formData.unit_id_enabled = _.isNull(unit_id);
    $scope.formData.instansi_id = instansi_id;
    $scope.formData.instansi_id_enabled = _.isNull(instansi_id);

    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.save = function () {
        $mdDialog.hide();
    };

    $scope.doRequest = function () {
        var data = {
            'sql': sql,
            'key_id': $scope.formData.key_id,
            'user_id': $scope.formData.user_id,
            'peran_id': $scope.formData.peran_id,
            'pegawai_id': $scope.formData.pegawai_id,
            'unit_id': $scope.formData.unit_id,
            'instansi_id': $scope.formData.instansi_id,
            'custom_variables': $scope.formData.custom_variables
        };

        if (EnvironmentConfig.showKoneksiModule) {
            data.koneksi_id = $scope.formData.koneksi_id;
        }

        var req = {
            method: 'POST',
            url: EnvironmentConfig.api + 'TemplateData/testquery',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            data: data
        };

        $http(req)
            .success(function (res) {
                $scope.formData.strJson = AppFactory.syntaxHighlight(res.data);
            })
            .error(function (err) {
                AppFactory.showToast(err.message, 'error', err.errors);
            });
    };
}
