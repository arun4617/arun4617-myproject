/*
* Export required google config object and url. Node environment variable resposible to change the site url and base url
* For environment setup refere https://prezentium.sharepoint.com/:o:/r/sites/lisadev/_layouts/15/WopiFrame.aspx?sourcedoc=%7B74249145-efab-44a7-8765-81aafe4b8948%7D&action=edit&wd=target%28Development%2Eone%7C8830A455-AB7E-44DB-8BAC-96054150AC55%2FBuild%20and%20locally%20run%20web%20add-in%7C81D23551-BEDB-4BF8-9A37-371491442F28%2F%29
*/
function getEnvURL() {
    var site_url = "http://localhost:3000";
    var base_url = "http://localhost:4200";
    if(typeof process.env.NODE_ENV != 'undefined'){
        switch (process.env.NODE_ENV) {
            case 'lisa-prod':
                site_url = "https://lisa-prod.prezentium.com"
                base_url = site_url;
                break;
            case 'lisa-dev':
                site_url = "https://lisa-dev.prezentium.com";
                base_url = site_url;
                break;
            case 'vpn-ng-dev':
                site_url = "https://localhost:3000"
                base_url = "http://localhost:4200"
                break;
            case 'vpn-node-dev':
                site_url = base_url = "https://localhost:3000"
                break;
            default:
                break;
        }
    }
    return {SITEURL:site_url, BASEURL:base_url};
}
var urlDataSet = getEnvURL();
module.exports = {
    BASEURL: urlDataSet.BASEURL,
    SITEURL: urlDataSet.SITEURL,
    googleConf: {
        clientID: '682983443363-cm4mhc6u23ubd63hccmpaouqnb90pllu.apps.googleusercontent.com',
        clientSecret: 'e2CK3VmiO0xlsO-mXCaf3MIe',
        callbackURL: urlDataSet.SITEURL + '/api/google-auth/google/callback', // whatever url creates here, it must be set in google app as callback url
        passReqToCallback: true
    }
}
