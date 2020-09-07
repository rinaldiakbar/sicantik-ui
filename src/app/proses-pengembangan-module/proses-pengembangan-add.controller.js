(function() {
    'use strict';

    angular
        .module('proses-pengembangan-module')
        .controller('ProsesPengembanganAdd', ProsesPengembanganAdd);

    /* @ngInject */
    function ProsesPengembanganAdd($http, APP_CONFIG, $state, EnvironmentConfig, $log, $timeout, AppFactory, Upload, ProsesPengembanganFactory) {
        var vm = this;
        
        vm.ProsesPengembangan = {
            penyelesaian : '',
            del: 0,
            tgl_aduan: new Date()
        };
        vm.ProsesPengembangan.c_aduan_lampiran = [];
        vm.ProsesPengembangan.c_aduan_komentar = [];

        ProsesPengembanganFactory.getFormatNumber().then(function (res) {
            vm.result = res.data.data;
            vm.ProsesPengembangan.no_tiket = vm.result.number;
        });

        /*** BEGIN - Autocomplete for Pegawai ***/
        vm.selectedItemPegawai = null;
        vm.searchTextPegawai = null;
        vm.querySearchPegawai = ProsesPengembanganFactory.querySearchPegawai;
        vm.isDisabledPegawai = false;
        vm.noCachePegawai = true;
        vm.selectedItemChangePegawai = selectedItemChangePegawai;

        function selectedItemChangePegawai(item) {
            if (angular.isDefined(item)) {
                vm.ProsesPengembangan.penanggung_jawab = item.nama;
            } else {
                vm.ProsesPengembangan.penanggung_jawab = null;
            }
        }
        /*** END - Autocomplete for Pegawai ***/

        /*** BEGIN - Autocomplete for Kategori ***/
        vm.selectedItem = null;
        vm.searchText = null;
        vm.querySearch = ProsesPengembanganFactory.querySearchKategori;
        vm.isDisabled = false;
        vm.noCache = true;
        vm.selectedItemChange = selectedItemChange;

        function selectedItemChange(item) {
            if (angular.isDefined(item)) {
                vm.ProsesPengembangan.kategori = item.path;

            } else {
                vm.ProsesPengembangan.kategori = null;
            }
        }
        /*** END - Autocomplete for Kategori ***/

        

        vm.createAction = createAction;
        vm.cancelAction = ProsesPengembanganFactory.cancelAction;

        function createAction() {
            var reqData = vm.ProsesPengembangan;
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
                    $state.go('triangular.admin-default.proses-pengembangan');
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
                        vm.ProsesPengembangan.file_url = resp.data.data.file_url;
                        vm.ProsesPengembangan.file_lampiran = resp.data.data.file_name;
                        if (vm.ProsesPengembangan.c_aduan_lampiran.length == 0) {
                            vm.ProsesPengembangan.c_aduan_lampiran.push({
                                'del':0,
                                'file_lampiran': resp.data.data.file_name,
                                'keterangan':vm.ProsesPengembangan.keterangan
                            });
                        }
                    }else{
                        vm.ProsesPengembangan.file_url_komentar = resp.data.data.file_url;
                        vm.ProsesPengembangan.file_lampiran_komentar = resp.data.data.file_name;
                        if (vm.ProsesPengembangan.c_aduan_komentar.length == 0) {
                            vm.ProsesPengembangan.c_aduan_komentar.push({
                                'del' : 0,
                                'file_lampiran': resp.data.data.file_name,
                                'komentar':vm.ProsesPengembangan.komentar
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
