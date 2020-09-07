(function() {
    'use strict';

    angular
        .module('unit-module')
        .controller('UnitEditController', UnitEditController);

    /* @ngInject */
    function UnitEditController(
        $http, $state, EnvironmentConfig, $stateParams, $log, $timeout, AppFactory, UnitFactory, $mdDialog, Upload,
        _
    ) {
        var vm = this;
        var id = $stateParams.id;
        vm.unit = {
            nama: '',
            tipe: '',
            kode_daerah: '',
            parent_id: null,
            logo: null,
            ws_url: null,
            instansi_code: null,
            lat: null,
            long: null
        };
        vm.unit.parent_id_enabled = true;
        vm.searchTextKodeDaerah = '';
        vm.searchTextUnit = '';

        UnitFactory.getTipeListService().then(function(res) {
            vm.optionTipe = res.data.data.items;
        });

        UnitFactory.getUnit(id).then(function(res) {
            angular.copy(res.data.data, vm.unit);
            if (!_.isNull(res.data.data.parent_unit)) {
                vm.searchTextUnit = res.data.data.parent_unit.nama;
            }
            vm.searchTextKodeDaerah = res.data.data.kode_daerah;
            tipeChanged();
        });

        vm.updateAction = updateAction;
        vm.cancelAction = UnitFactory.cancelAction;
        vm.deleteAction = deleteAction;
        vm.tipeChanged = tipeChanged;

        function updateAction() {
            var reqData = {
                nama: vm.unit.nama,
                tipe: vm.unit.tipe,
                parent_id: vm.unit.parent_id,
                kode_daerah: vm.unit.kode_daerah,
                logo: vm.unit.logo,
                ws_url: vm.unit.ws_url,
                instansi_code: vm.unit.instansi_code,
                lat: vm.unit.lat,
                long: vm.unit.long
            };
            var req = {
                method: 'PUT',
                url: EnvironmentConfig.api + 'unit/' + id,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res) {
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.unit');
                })
                .error(function(err) {
                    if (err.message) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    }
                });
        }

        function deleteAction() {
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
            ).then(function() {
                UnitFactory.deleteUnit(id).then(function(res) {
                    if (res.message) {
                        AppFactory.showToast(res.message);
                    }
                    $state.go('triangular.admin-default.unit');
                });
            });
        }

        function tipeChanged() {
            switch (vm.unit.tipe) {
                case 'I':
                    // disable Parent Unit
                    vm.unit.parent_id_enabled = false;
                    vm.unit.parent_id = null;
                    break;
                default:
                    vm.unit.parent_id_enabled = true;
                    break;
            }
        }

        /*** BEGIN - Autocomplete for Kode Daerah ***/
        vm.selectedItemKodeDaerah = null;
        vm.querySearchKodeDaerah = UnitFactory.querySearchKodeDaerah;
        vm.selectedItemChangeKodeDaerah = selectedItemChangeKodeDaerah;

        //////////////////
        function selectedItemChangeKodeDaerah(item) {
            if (angular.isDefined(item)) {
                vm.unit.kode_daerah = item.kode_daerah;
                $log.info('Kode Daerah changed to ' + item);
            } else {
                vm.unit.kode_daerah = null;
            }
        }
        /*** END - Autocomplete for Parent Kode Daerah ***/

        /*** BEGIN - Autocomplete for Unit ***/
        vm.selectedItemUnit = null;
        vm.querySearchStruktur = UnitFactory.querySearchStruktur;
        vm.selectedItemChangeUnit = selectedItemChangeUnit;

        //////////////////
        function selectedItemChangeUnit(item) {
            if (angular.isDefined(item)) {
                $log.info('Unit changed to ' + item);
                vm.unit.parent_id = item.id;
            } else {
                vm.unit.parent_id = null;
            }
        }
        /*** END - Autocomplete for Parent Unit ***/

        /** BEGIN - File Upload **/
        vm.upload_status = 'idle'; // idle | uploading | complete
        vm.upload = upload;
        var fileList;

        function upload($files) {
            if (!_.isNull($files) && $files.length > 0) {
                fileList = $files;

                uploadStarted();

                // $timeout(uploadComplete, 4000);

                Upload.upload({
                    url: EnvironmentConfig.api + 'Unit/upload',
                    data: { file: fileList }
                }).then(function(resp) {
                    $log.info('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.message);
                    vm.unit.logo = resp.data.data.file_name;
                    uploadComplete();
                }, function(resp) {
                    $log.error('Error status: ' + resp.status);
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $log.info('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            }
        }

        function uploadStarted() {
            vm.upload_status = 'uploading';
        }

        function uploadComplete() {
            vm.upload_status = 'complete';
            var message = 'Berhasil upload ';
            for (var file in fileList) {
                message += fileList[file].name + ' ';
            }
            AppFactory.showToast(message);

            $timeout(uploadReset, 3000);
        }

        function uploadReset() {
            vm.upload_status = 'idle';
        }
        /** END - File Upload **/
    }
})();