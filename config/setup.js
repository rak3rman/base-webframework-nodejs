/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
Filename : base/config/setup.js
Desc     : checks and sets up configuration values
           in config.json using data-store
Author(s): RAk3rman
\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/

// Packages
const chalk = require('chalk');
const wipe = chalk.white;
const moment = require('moment');

// Name : setup.check_values()
// Desc : checks all config.json values and configures each value if invalid
// Author(s) : RAk3rman
exports.check_values = function (config_storage) {
    console.log(wipe(`${chalk.bold.cyan('Setup')}:   [` + moment().format('MM/DD/YY-HH:mm:ss') + `] Checking configuration values`));
    let invalid_config = false;
    // Config value: webserver_port | the port where the webserver will listen for requests
    if (!config_storage.has('webserver_port') || config_storage.get('webserver_port') === '') {
        config_storage.set('webserver_port', 3000);
        console.log(wipe(`${chalk.bold.cyan('Setup')}:   [` + moment().format('MM/DD/YY-HH:mm:ss') + `] "webserver_port" value in config.json set to default: "3000"`));
    }
    // Exit if the config values are not set properly
    if (invalid_config) {
        console.log(wipe(`${chalk.bold.cyan('Setup')}:   [` + moment().format('MM/DD/YY-HH:mm:ss') + `] Please check "config.json" and configure the appropriate values`));
        process.exit(0);
    } else {
        console.log(wipe(`${chalk.bold.cyan('Setup')}:   [` + moment().format('MM/DD/YY-HH:mm:ss') + `] Configuration values have been propagated`));
    }
}