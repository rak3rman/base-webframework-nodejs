/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
App/Filename : BASE/app.js
Description  : Initializes nodejs
Author       : RAk3rman
\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/

//===================================================//
//     --- Initialize Packages and Routers ---       //
//===================================================//

//Declare Packages
let express = require('express');
let session = require('express-session');
let morgan = require('morgan');
let createError = require('http-errors');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let ip = require('ip');
let uuidv4 = require('uuid/v4');

//Setup Local Database
let dataStore = require('data-store');
let storage = new dataStore({path: './config/sysConfig.json'});

//System Config Checks - - - - - - - - - - - - - - - - -
//Session Secret Check
let session_secret = storage.get('session_secret');
if (session_secret === undefined) {
    let newSecret = uuidv4();
    storage.set('session_secret', newSecret);
    console.log('Config Manager: Session Secret Set - ' + newSecret);
}
//Console Port Check
let console_port = storage.get('console_port');
if (console_port === undefined) {
    storage.set('console_port', 3000);
    console.log('Config Manager: Port Set to DEFAULT: 3000');
}
//End of System Config Checks - - - - - - - - - - - - - -

//Declare App
const app = express();
app.set('view engine', 'ejs');

//Initialize Exit Options
let exitOpt = require('./config/exitOpt.js');
setTimeout(exitOpt.testCheck, 3000);

//Routers
let mainRoutes = require('./routes/mainRoutes.js');

//Express Processes/Packages Setup
app.use(session({
    secret: storage.get('session_secret'),
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/static', express.static(process.cwd() + '/static'));

//End of Initialize Packages and Routers - - - - - - - -


//===================================================//
//       --- LEMAgent Config Routes/Logic  ---       //
//===================================================//

//Create Routes
app.get('/', mainRoutes.homeRoute);

//End of LEMAgent Config Routes/Logic - - - - - - - - -


//===================================================//
//              --- Error Handlers ---               //
//===================================================//

//404 - Send to Error Handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error Handler Logic
app.use(function (err, req, res, next) {
    //Determine Message
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    //Render Error Page
    res.status(err.status || 500);
    res.render('pages/error.ejs', {title: 'Error'});
});

//End of Error Handler - - - - - - - - - - - - - - - - -


//===================================================//
//        --- External Connections Setup ---         //
//===================================================//

//Port Listen
let http = require('http');
let server = http.createServer(app);
server.listen(storage.get('console_port'), function () {
    console.log(' ');
    console.log('============================================');
    console.log('  Base-WebFramework-NodeJS | RAk3rman 2019  ');
    console.log('============================================');
    console.log('Web Page Accessable at: ' + ip.address() + ":" + storage.get('console_port'));
    console.log(' ');
});

//End of External Connections Setup - - - - - - - - - -

//Export Express
module.exports = app;
