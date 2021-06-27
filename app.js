/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
Filename : base/app.js
Desc     : main application file
Author(s): RAk3rman
\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/

// Packages and configuration - - - - - - - - - - - - - - - - - - - - - - - - -

// Declare packages
const path = require('path');
const dataStore = require('data-store');
const config_storage = new dataStore({path: './config/config.json'});
const chalk = require('chalk');
const pkg = require('./package.json');
const moment = require('moment');
const wipe = chalk.white;

// Print header to console
console.clear();
console.log(chalk.blue.bold('\nBase Webframework v' + pkg.version + ((process.argv[2] !== undefined) ? ' | ' + process.argv[2].toUpperCase() : "" )));
console.log(chalk.white('--> Contributors: ' + pkg.author));
console.log(chalk.white('--> Description: ' + pkg.description));
console.log(chalk.white('--> Github: ' + pkg.homepage + '\n'));

// Check configuration values
let setup = require('./config/setup.js');
setup.check_values(config_storage);

// End of Packages and configuration - - - - - - - - - - - - - - - - - - - - - -

// Fastify and main functions - - - - - - - - - - - - - - - - - - - - - - - - - -

// Declare fastify
const fastify = require('fastify')({logger: false});

// Prepare rendering template
fastify.register(require('point-of-view'), {
    engine: {
        handlebars: require('handlebars')
    },
})
fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
})
// fastify.register(require('fastify-socket.io'), {})
// fastify.register(require('fastify-formbody'))
// fastify.register(require('fastify-rate-limit'), {
//     global: false,
//     max: 250,
//     timeWindow: '1 minute'
// })

// Routers
let error_routes = require('./routes/error-routes.js');

// Import routes
error_routes(fastify);

// Home page
fastify.get('/', (req, reply) => {
    reply.view('/templates/home.hbs', {
        title: "Home"
    })
    console.log(wipe(`${chalk.bold.magenta('Fastify')}: [` + moment().format('MM/DD/YY-HH:mm:ss') + `] GET /`));
})

// End of Fastify and main functions - - - - - - - - - - - - - - - - - - - - - -


// Setup external connections - - - - - - - - - - - - - - - - - - - - - - - - -

// Start webserver using config values
console.log(wipe(`${chalk.bold.magenta('Fastify')}: [` + moment().format('MM/DD/YY-HH:mm:ss') + `] Attempting to start http webserver on port ` + config_storage.get('webserver_port')));
fastify.listen(config_storage.get('webserver_port'), function (err) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(wipe(`${chalk.bold.magenta('Fastify')}: [` + moment().format('MM/DD/YY-HH:mm:ss') + `] Running http webserver on port ` + config_storage.get('webserver_port')));
    // Check if we are testing
    const testing = require('./config/testing.js');
    testing.testCheck();
})

// End of Setup external connections - - - - - - - - - - - - - - - - - - - - - -
