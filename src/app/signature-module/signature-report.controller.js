(function () {
    'use strict';

    angular
        .module('signature-module')
        .controller('SignatureReport', SignatureReport);

    /* @ngInject */
    function SignatureReport(
        $stateParams, $state, $http, $log, $scope, $mdDialog, $timeout, $document, APP_CONFIG, EnvironmentConfig,
        Upload, FormFactory, AppFactory, SignatureFactory, ProsesPengajuanFactory, PermohonanIzinFactory
    ) {
        var vm = this;
        var certInput;
        var BASE64_MARKER = ';base64,';
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        var permohonanIzinId, templateDataId;
        var prosesPermohonanId = $stateParams.proses_permohonan_id;

        vm.form = {
            cert: new Uint8Array(),
            pass: null
            // pass: 'NUb6ti' // TODO remove this
        };
        vm.prosesPermohonan = {};
        vm.signReport = signReport;
        vm.enableNext = false;
        vm.enableDownload = false; // Only enable if report is successfully signed
        vm.cancelAction = ProsesPengajuanFactory.cancelAction;
        vm.downloadSignedReport = downloadSignedReport;
        vm.saveAndNext = saveAndNext;
        vm.viewFile = viewFile;
        vm.cancelSign = cancelSign;

        loadProsesPermohonan(prosesPermohonanId);


        //////////////////////////////

        /**
         * Load Proses Permohonan and enable download signed report if already signed
         * @param prosesPermohonanId
         */
        function loadProsesPermohonan(prosesPermohonanId) {
            SignatureFactory.getProsesPermohonan(prosesPermohonanId).then(function (res) {
                vm.prosesPermohonan = res.data.data;
                if (vm.prosesPermohonan.status === 'Selesai' || vm.prosesPermohonan.file_signed_report) {
                    vm.enableNext = true;
                }
                permohonanIzinId = vm.prosesPermohonan.permohonan_izin_id;
                templateDataId = vm.prosesPermohonan.template_data_id;
            });
        }

        function convertDataURIToBinary(dataURI) {
            var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            var base64 = dataURI.substring(base64Index);
            return decodeBase64(base64);
        }

        /**
         *
         *  Base64 encode / decode
         *  http://www.webtoolkit.info/
         *
         *  window.atob -> browser/node.js dependant, this works on any engine
         *
         **/
        function encodeBase64(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            while (i < input.length) {
                chr1 = input[i++];
                chr2 = input[i++];
                chr3 = input[i++];

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }
            return output;
        }

        function decodeBase64(input) {
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            var size = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            var uint8 = new Uint8Array(input.length);

            while (i < input.length) {

                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                uint8[size++] = (chr1 & 0xff);
                if (enc3 !== 64) {
                    uint8[size++] = (chr2 & 0xff);
                }
                if (enc4 !== 64) {
                    uint8[size++] = (chr3 & 0xff);
                }

            }
            return uint8.subarray(0, size);
        }

        function handleFileSelect1(evt) {
            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = function (event) {
                var base64Index = event.target.result.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
                certInput = event.target.result;
                certInput = certInput.substring(base64Index);
            };
            reader.readAsDataURL(file);
        }

        document.getElementById('cert').addEventListener('change', handleFileSelect1, false);

        function createPDFDownload(array, filename) {
            var a = window.document.createElement('a');
            a.href = window.URL.createObjectURL(new Blob([array], {type: 'application/pdf'}));
            a.download = filename;
            // Append anchor to body.
            document.body.appendChild(a);
            a.click();
            // Remove anchor from body
            document.body.removeChild(a);
        }

        /**
         * Get PDF and sign it in browser, then upload back to the server
         */
        function signReport() {
            try {
                // Validate the input
                if (certInput.length === 0) {
                    throw 'Pilih Sertifikat terlebih dahulu';
                }

                if (vm.form.pass.length === 0) {
                    throw 'Password Sertifikat harus diisi';
                }

                var dataUrl = EnvironmentConfig.api + 'TemplateData/signReport';
                var params = {
                    'key_id': permohonanIzinId
                };
                dataUrl += AppFactory.httpBuildQuery(params);

                Upload.upload({
                    url: dataUrl,
                    data: {
                        'cert': certInput,
                        'pass': vm.form.pass,
                        'proses_permohonan_id': prosesPermohonanId
                    }
                }).then(function (resp) {
                    AppFactory.showToast(resp.data.message);
                    loadProsesPermohonan(prosesPermohonanId);
                    vm.enableNext = true;
                }, function (resp) {
                    AppFactory.showToast(resp.data.message, 'error');
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $log.info('Progress: ' + progressPercentage + '% ');
                });
            } catch (ex) {
                AppFactory.showToast(ex, 'error');
            }
        }

        function downloadSignedReport(filename) {
            AppFactory.downloadFile(filename, 'signed');
        }

        function saveAndNext() {
            PermohonanIzinFactory.getNextStep(permohonanIzinId, prosesPermohonanId);
        }
        
        function viewFile(filePath) {
            FormFactory.viewFile(filePath, $scope, $document.body, 'signed');
        }
        
        function cancelSign() {
            var reqData = {
                prosesPermohonanId: prosesPermohonanId,
                permohonanIzinId: permohonanIzinId
            };

            var req = {
                method: 'POST',
                url: EnvironmentConfig.api + 'TemplateData/cancelSignReport',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: reqData
            };

            $http(req)
                .success(function () {
                    loadProsesPermohonan(prosesPermohonanId);
                    AppFactory.showToast('Tanda tangan berhasil dibatalkan');
                })
                .error(function (err) {
                    AppFactory.showToast(err.message, 'error', err.errors);
                });
        }
    }
})();
