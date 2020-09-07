(function() {
    'use strict';

    angular
        .module('app')
        .config(translateConfig);

    /* @ngInject */
    function translateConfig(
        triSettingsProvider, triRouteProvider, triLayoutProvider,
        APP_LANGUAGES, AppConfig, EnvironmentConfig) {

        var now = new Date();

        // set app name & logo (used in loader, sidemenu, footer, login pages, etc)
        triSettingsProvider.setName(EnvironmentConfig.name);
        triSettingsProvider.setCopyright('&copy;' + now.getFullYear() + ' ' + EnvironmentConfig.copyright);
        triSettingsProvider.setLogo(EnvironmentConfig.logo);
        triSettingsProvider.setSubLogo(EnvironmentConfig.subLogo);

        // set current version of app (shown in footer)
        triSettingsProvider.setVersion(AppConfig.version);

        // Set Favicon
        triSettingsProvider.setFavicon(EnvironmentConfig.favicon);
        triSettingsProvider.setFaviconType(EnvironmentConfig.faviconType);

        // set the document title that appears on the browser tab
        triRouteProvider.setTitle(EnvironmentConfig.title);
        triRouteProvider.setSeparator('|');

        // set login background
        triSettingsProvider.setLoginBackground(EnvironmentConfig.loginBackground);

        // set layout
        triLayoutProvider.setDefaultOption('sideMenuSize', EnvironmentConfig.sideMenuSize);

        // setup available languages in triangular
        for (var lang = APP_LANGUAGES.length - 1; lang >= 0; lang--) {
            triSettingsProvider.addLanguage({
                name: APP_LANGUAGES[lang].name,
                key: APP_LANGUAGES[lang].key
            });
        }
    }
})();