(function() {
    'use strict';

    angular
        .module('penanganan-aduan-module')
        .controller('PenangananAduanAdd', PenangananAduanAdd);

    /* @ngInject */
    function PenangananAduanAdd($http, APP_CONFIG, $state, EnvironmentConfig, $log, $timeout, AppFactory, Upload, PenangananAduanFactory) {
        var vm = this;
        
        vm.PenangananAduan = {
            penyelesaian : '',
            del: 0,
            tgl_aduan: new Date()
        };
        vm.PenangananAduan.c_aduan_lampiran = [];
        vm.PenangananAduan.c_aduan_komentar = [];

        PenangananAduanFactory.getFormatNumber().then(function (res) {
            vm.result = res.data.data;
            vm.PenangananAduan.no_tiket = vm.result.number;
        });

        /*** BEGIN - Autocomplete for Pegawai ***/
        vm.selectedItemPegawai = null;
        vm.searchTextPegawai = null;
        vm.querySearchPegawai = PenangananAduanFactory.querySearchPegawai;
        vm.isDisabledPegawai = false;
        vm.noCachePegawai = true;
        vm.selectedItemChangePegawai = selectedItemChangePegawai;

        function selectedItemChangePegawai(item) {
            if (angular.isDefined(item)) {
                vm.PenangananAduan.penanggung_jawab = item.nama;
            } else {
                vm.PenangananAduan.penanggung_jawab = null;
            }
        }
        /*** END - Autocomplete for Pegawai ***/

        /*** BEGIN - Autocomplete for Kategori ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = PenangananAduanFactory.querySearchKategori;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChange;

        function selectedItemChange(item) {
            if (angular.isDefined(item)) {
                vm.PenangananAduan.kategori = item.path;

            } else {
                vm.PenangananAduan.kategori = null;
            }
        }
        /*** END - Autocomplete for Kategori ***/

        

        vm.createAction = createAction;
        vm.cancelAction = PenangananAduanFactory.cancelAction;

        function createAction() {
            var reqData = vm.PenangananAduan;
            reqData.tgl_aduan = moment(reqData.tgl_aduan).format('YYYY-MM-DD');
            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'caduan',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };
            $http(req)
                .success(function(res){
                    AppFactory.showToast(res.message);
                    $state.go('triangular.admin-default.penanganan-aduan');
                })
                .error(function(err){
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }

        /** BEGIN - File Upload **/
        vm.upload_status = 'idle'; // idle | uploading | complete
        vm.upload = upload;
        var fileList;

        function upload($files, $flag) {
            if ($files !== null && $files.length > 0) {
                fileList = $files;
                uploadStarted();
                Upload.upload({
                    url: EnvironmentConfig.api + 'DokumenPemohon/upload',
                    data: { file: fileList }
                }).then(function(resp) {
                    $log.info('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data.message);
                    if($flag == 'lampiran'){
                        vm.PenangananAduan.file_url = resp.data.data.file_url;
                        vm.PenangananAduan.file_lampiran = resp.data.data.file_name;
                        if (vm.PenangananAduan.c_aduan_lampiran.length == 0) {
                            vm.PenangananAduan.c_aduan_lampiran.push({
                                'del':0,
                                'file_lampiran': resp.data.data.file_name,
                                'keterangan':vm.PenangananAduan.keterangan
                            });
                        }
                    }else{
                        vm.PenangananAduan.file_url_komentar = resp.data.data.file_url;
                        vm.PenangananAduan.file_lampiran_komentar = resp.data.data.file_name;
                        if (vm.PenangananAduan.c_aduan_komentar.length == 0) {
                            vm.PenangananAduan.c_aduan_komentar.push({
                                'del' : 0,
                                'file_lampiran': resp.data.data.file_name,
                                'komentar':vm.PenangananAduan.komentar
                            });
                        }
                    }
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
