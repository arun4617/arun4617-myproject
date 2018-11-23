/* 
* Export config related to pm2. Its help to set the node enviornment variable as per  NODE_ENV
* Ref: http://pm2.keymetrics.io/docs/usage/environment/
*/
module.exports = {
    apps: [{
        name: 'server',
        script: './server.js',
        cwd: '/srv/lisa-ng/',
        instance_var: 'INSTANCE_ID',
        env_dev: {
            "PORT": 3000,
            "NODE_ENV": 'lisa-dev',
            "NODE_CONFIG_DIR": "/srv/lisa-ng/src/LisaTools/server/"
        },
        env_prod: {
            "PORT": 3000,
            "NODE_ENV": 'lisa-prod',
            "NODE_CONFIG_DIR": "/srv/lisa-ng/src/LisaTools/server/"
        }
    }]
};
 