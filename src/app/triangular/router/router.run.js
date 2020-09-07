(function() {
    'use strict';

    angular
        .module('triangular')
        .run(runFunction);

    /* @ngInject */
    function runFunction(
        $rootScope, $window, $state, $filter, $translate, $timeout, triRoute, triSettings,
        triBreadcrumbsService
    ) {
        var breadcrumbs = triBreadcrumbsService.breadcrumbs;
        init();

        var destroyOn = $rootScope.$on('$stateChangeSuccess', function(){
            setFullTitle();
            setFavicon();
            prepareApp();
        });

        $rootScope.$on('$destroy', function(){
            destroyOn();
        });

        function setFullTitle() {
            $timeout(function(){
                var title = triRoute.title;
                angular.forEach(breadcrumbs.crumbs, function(crumb){
                    title +=' ' + triRoute.separator + ' ' + $filter('translate')(crumb.name);
                });
                $window.document.title = title;
            });
        }

        function setFavicon() {
            $timeout(function() {
                var link = $window.document.querySelector('link[rel*="icon"]') || $window.document.createElement('link');
                link.href = triSettings.favicon ? triSettings.favicon : 'favicon.ico';
                link.type = triSettings.faviconType ? triSettings.faviconType : 'image/x-icon';
                link.rel = 'shortcut icon';
                $window.document.getElementsByTagName('head')[0].appendChild(link);
            });
        }

        function prepareApp() {
            $timeout(function() {
                $rootScope.loginBackground = triSettings.loginBackground;
            });
        }

        function init() {
            setFavicon();
            setFullTitle();
            prepareApp();
        }
    }
})();
