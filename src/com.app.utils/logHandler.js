var fs = require('fs'),
    appcfg = require('../com.app.configuration/appConf.json');

// next we'll to want make our Logger object available...
// to whatever file references it.
var Logger = (exports.Logger = {});

// The path of our log files in the first parameter of...
// fs.createWriteStream. This IS pulled in from config
const infoLog = __dirname + appcfg.application.logs.type.info.path;
const errorLog = __dirname + appcfg.application.logs.type.error.path;
const debugLog = __dirname + appcfg.application.logs.type.debug.path;

// Create 3 sets of write streams for the 3 levels of logging we wish to do
// every time we get an error we'll append to our error streams, any debug message
// to our debug stream etc...
var infoStream = fs.createWriteStream(infoLog, { encoding: 'utf-8' });
var errorStream = fs.createWriteStream(errorLog, { encoding: 'utf-8' });
var debugStream = fs.createWriteStream(debugLog, { encoding: 'utf-8' });

// Create 3 different functions
// each of which appends our given messages to
// their own log files along with the current date as an
// iso string and a \n newline character
Logger.info = function(mthd, msg) {
    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        message = date + '|' + mthd + '|' + msg + '\n';

    console.log('\n');
    console.log("=============Info Logging ===========") + '\n';
    console.log("===========Start============= " + date) + '\n';
    console.log("function: " + mthd) + '\n';
    console.log("msg: " + msg) + '\n';
    console.log("===========End============= " + date) + '\n';

    infoStream.write(message);
};

Logger.error = function(mthd, msg) {
    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        message = date + '|' + mthd + '|' + msg + '\n';

    console.log('\n');
    console.log("=============Error Logging ===========") + '\n';
    console.log("===========Start============= " + date) + '\n';
    console.log("function: " + mthd) + '\n';
    console.log("error: " + msg) + '\n';
    console.log("===========End============= " + date) + '\n';

    errorStream.write(message);
};

Logger.debug = function(mthd, err, msg) {
    var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        message = date + '|' + mthd + '|' + err + '|' + msg + '\n';

    console.log('\n');
    console.log("=============Debug Logging ===========") + '\n';
    console.log("===========Start============= " + date) + '\n';
    console.log("function: " + mthd) + '\n';
    console.log("error: " + err) + '\n';
    console.log("trace: " + msg);
    console.log("===========End============= " + date) + '\n';

    debugStream.write(message);
};

Logger.console = function(mthd, msg) {
    console.log('\n');
    console.log("=============Console Logging ===========") + '\n';
    console.log("===========Start============= " + date) + '\n';
    console.log("function: " + mthd) + '\n';
    console.log("msg: " + msg) + '\n';
    console.log("===========End============= " + date) + '\n';
};