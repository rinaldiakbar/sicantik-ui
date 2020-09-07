(function() {
    'use strict';
    angular
        .module('notifikasi-module', [])
        .factory('NotifikasiFactory', NotifikasiFactory);

    function NotifikasiFactory($http, $log, $state, AppFactory, EnvironmentConfig) {
        return {
            getNotifikasi: getNotifikasi,
            getSupportData: getSupportData,
            deleteNotifikasiDetail: deleteNotifikasiDetail,
            cancelAction: cancelAction
        };

        function getNotifikasi(id) {
            var getDataReq = {
                method: 'GET',
                url: EnvironmentConfig.api + 'notifikasi/' + id,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };
            return $http(getDataReq)
                .error(function() {
                    $state.go('triangular.admin-default.notifikasi');
                });
        }

        function getSupportData() {
            var req = {
                method: 'GET',
                url: EnvironmentConfig.api + 'notifikasi/supportdata',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            };

            return $http(req)
              .error(function(err) {
                  $log.error(err);
              });
        }

        function deleteNotifikasiDetail(notifikasiDetailId) {
            var req = {
                method: 'DELETE',
                url: EnvironmentConfig.api + 'Notifikasi/deleteNotifikasiDetail/' + notifikasiDetailId,
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

        function cancelAction() {
            $state.go('triangular.admin-default.notifikasi');
        }
    }
})();

function PesanDialogController($scope, $mdDialog, formatPesan, disabled) {
    $scope.formData = {};
    $scope.formData.format_pesan = formatPesan;
    $scope.formData.disabled = disabled;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.save = function() {
        $mdDialog.hide($scope.formData);
    };
}