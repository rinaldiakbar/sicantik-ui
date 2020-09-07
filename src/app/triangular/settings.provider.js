(function() {
    'use strict';

    angular
        .module('triangular')
        .provider('triSettings', settingsProvider);

    /* @ngInject */
    function settingsProvider() {
        // Provider
        var settings = {
            languages: [],
            name: '',
            logo: '',
            subLogo: '',
            copyright: '',
            version: '',
            favicon: '',
            faviconType: '',
            loginBackground: ''
        };

        this.addLanguage = addLanguage;
        this.setLogo = setLogo;
        this.setSubLogo = setSubLogo;
        this.setName = setName;
        this.setCopyright = setCopyright;
        this.setVersion = setVersion;
        this.setFavicon = setFavicon;
        this.setFaviconType = setFaviconType;
        this.setLoginBackground = setLoginBackground;

        function addLanguage(newLanguage) {
            settings.languages.push(newLanguage);
        }

        function setLogo(logo) {
            settings.logo = logo;
        }

        function setSubLogo(subLogo) {
            settings.subLogo = subLogo;
        }

        function setName(name) {
            settings.name = name;
        }

        function setCopyright(copy) {
            settings.copyright = copy;
        }

        function setVersion(version) {
            settings.version = version;
        }

        function setFavicon(favicon) {
            settings.favicon = favicon;
        }

        function setFaviconType(faviconType) {
            settings.faviconType = faviconType;
        }

        function setLoginBackground(loginBackground) {
            settings.loginBackground = loginBackground;
        }

        // Service
        this.$get = function() {
            return {
                languages: settings.languages,
                name: settings.name,
                copyright: settings.copyright,
                logo: settings.logo,
                subLogo: settings.subLogo,
                version: settings.version,
                defaultSkin: settings.defaultSkin,
                favicon: settings.favicon,
                faviconType: settings.faviconType,
                loginBackground: settings.loginBackground
            };
        };
    }
})();

