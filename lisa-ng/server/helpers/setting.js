function getEnvURL() {
    var site_url = "http://localhost:3000";
    var base_url = "http://localhost:4200";
    if(typeof process.env.NODE_ENV != 'undefined'){
        switch (process.env.NODE_ENV) {
            case 'lisa-prod':
                site_url = "https://lisa-prod.com"
                base_url = site_url;
                break;
            case 'lisa-dev':
                site_url = "https://lisa-dev.com";
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
        clientID: '123321557763-cm4mhc6u23ubd63hccmpaouqnb90pllu.apps.googleusercontent.com',
        clientSecret: 'e5Cf5VmiO0xlsO-mXCaf3MIe',
        callbackURL: urlDataSet.SITEURL + '/api/google-auth/google/callback', // whatever url creates here, it must be set in google app as callback url
        passReqToCallback: true
    }
}
