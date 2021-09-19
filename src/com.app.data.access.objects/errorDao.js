var fs = require('fs'),
    appcfg = require('../com.app.configuration/appConf.json');

class ErrorDAO {

    constructor() {}

    static GetInfoErrSQL(objs, callback) {
        var filePath = __dirname + appcfg.application.logs.type.info.path;
        let data = fs.readFileSync(filePath, 'utf8');
        let rows = data.split('\n');
        let array = rows.map(eachrow => {
            let row = eachrow.split('|');
            return row;
        });

        let result = array.filter(obj => {
            let first = new Date(objs.startDate);
            let last = new Date(objs.endDate);
            return (new Date(obj[0]) >= first && new Date(obj[0]) <= last);
        });

        callback(result);
    }

    static GetErrSQL(objs, callback) {
        var filePath = __dirname + appcfg.application.logs.type.error.path;
        let data = fs.readFileSync(filePath, 'utf8');
        let rows = data.split('\n');
        let array = rows.map(eachrow => {
            let row = eachrow.split('|');
            return row;
        });

        let result = array.filter(obj => {
            let first = new Date(objs.startDate);
            let last = new Date(objs.endDate);
            return (new Date(obj[0]) >= first && new Date(obj[0]) <= last);
        });

        callback(result);
    }

    static GetDebugErrSQL(objs, callback) {
        var filePath = __dirname + appcfg.application.logs.type.debug.path;
        let data = fs.readFileSync(filePath, 'utf8');
        let rows = data.split('\n');
        let array = rows.map(eachrow => {
            let row = eachrow.split('|');
            return row;
        });

        let result = array.filter(obj => {
            let first = new Date(objs.startDate);
            let last = new Date(objs.endDate);
            return (new Date(obj[0]) >= first && new Date(obj[0]) <= last);
        });

        callback(result);
    }
}

module.exports = ErrorDAO;