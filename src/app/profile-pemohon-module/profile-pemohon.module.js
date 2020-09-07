(function() {
    'use strict';

    angular
        .module('profile-pemohon-module', [
        ])
        .factory('ProfilePemohonFactory', ProfilePemohonFactory);

        /*** ProfilePemohon Factory ***/
        function ProfilePemohonFactory($http, $state, $log, EnvironmentConfig, APP_CONFIG, AppFactory) {
            return {
                getPagedProfilePemohon: getPagedProfilePemohon,
                getProfilePemohon: getProfilePemohon,
                deleteProfilePemohon: deleteProfilePemohon,
                getPagedDokumenProfilePemohon: getPagedDokumenProfilePemohon,
                getDokumenProfilePemohon: getDokumenProfilePemohon,
                getDokumenProfilePemohonList: getDokumenProfilePemohonList,
                compareDokumenProfilePemohon: compareDokumenProfilePemohon,
                cancelAction: cancelAction,
                backToProfilePemohonView: backToProfilePemohonView
            };

            ///////////
            /**
             * Get ProfilePemohon data
             * we use pemohon/view to make sure endpoint will be pemohon/view and not pemohon/index
             */
            function getProfilePemohon(keyId) {
                var url = EnvironmentConfig.api + 'pemohon/view/';

                if (angular.isDefined(keyId)) {
                    url += keyId;
                }

                var getDataReq = {
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };

                return $http(getDataReq)
                    .success(function(res) {})
                    .error(function(err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }

            function deleteProfilePemohon(id) {
                var req = {
                    method: 'DELETE',
                    url: EnvironmentConfig.api + 'pemohon/' + id,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res) {
                        AppFactory.showToast(res.message);
                    })
                    .error(function(err) {
                        AppFactory.showToast(err.message, 'error', err.errors);
                    });
            }

            function getPagedProfilePemohon(query) {
                var order = query.order === 'id' ? 'desc' : 'asc';

                var req = {
                    method: 'GET',
                    url: EnvironmentConfig.api + 'pemohon?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit + '&order=' + order,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };
                return $http(req)
                    .success(function(res) {
                        //console.log(res);
                    })
                    .error(function(err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }

            function getPagedDokumenProfilePemohon(query) {
                var order = query.order === 'id' ? 'desc' : 'asc';
                var url = EnvironmentConfig.api + 'dokumen_pemohon?q=' + query.filter + '&page=' + query.page + '&limit=' + query.limit + '&order=' + order;

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
                    .success(function(res) {
                        //console.log(res);
                    })
                    .error(function(err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }

            /**
             * Get Dokumen ProfilePemohon data
             */
            function getDokumenProfilePemohon(id) {
                var url = EnvironmentConfig.api + 'dokumen_pemohon/' + id;

                var getDataReq = {
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                };

                return $http(getDataReq)
                    .success(function(res) {})
                    .error(function(err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }

            function getDokumenProfilePemohonList(query) {
                var url = EnvironmentConfig.api + 'dokumen_pemohon/list?q=' + query.q;

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
                    .success(function(res) {
                        //console.log(res);
                    })
                    .error(function(err) {
                        if (err.message) {
                            AppFactory.showToast(err.message, 'error', err.errors);
                        }
                    });
            }

            function cancelAction() {
                $state.go('triangular.admin-default.profile-pemohon-list');
            }

            function backToProfilePemohonView(id) {
                $state.go('triangular.admin-default.profile-pemohon-view', {'key_id': id});
            }

            /**
             * Function to check if pemohon already has the required documents
             * @param pemohonId
             * @param persyaratanArr
             */
            function compareDokumenProfilePemohon(pemohonId, persyaratanArr) {
                var queryString = {
                    'q': null,
                    'pemohon_id': pemohonId
                };

                getDokumenProfilePemohonList(queryString).then(function (res) {
                    var dokumenProfilePemohon = res.data.data.items;

                    persyaratanArr.forEach(function(val, key) {
                        // Find if pemohon has matching documents
                        var matchingDoc = _.find(dokumenProfilePemohon, function(o) { return o.jenis_dokumen_id === val.jenis_dokumen_id});

                        if (angular.isDefined(matchingDoc)) {
                            if (persyaratanArr[key].terpenuhi !== 1) {
                                persyaratanArr[key].no_dokumen = matchingDoc.no_dokumen;

                                if (angular.isDefined(matchingDoc.awal_berlaku)) {
                                    persyaratanArr[key].awal_berlaku = moment(matchingDoc.awal_berlaku, APP_CONFIG.datepickerFormat).toDate();
                                }

                                if (angular.isDefined(matchingDoc.akhir_berlaku)) {
                                    persyaratanArr[key].akhir_berlaku = moment(matchingDoc.akhir_berlaku, APP_CONFIG.datepickerFormat).toDate();
                                }

                                if (angular.isDefined(matchingDoc.lokasi_dokumen)) {
                                    persyaratanArr[key].lokasi_dokumen = matchingDoc.lokasi_dokumen;
                                }

                                persyaratanArr[key].terpenuhi = 1;
                            }
                        }
                    });
                });
            }
        }
        /*** Perusahaan Factory ***/
        
})();
