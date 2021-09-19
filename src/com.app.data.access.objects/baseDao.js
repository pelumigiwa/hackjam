var define = require('node-requirejs-define'),
    mysql = require('mysql'),
    dbcfg = require('../com.app.configuration/dbConf.json'),
    logger = require('../com.app.utils/logHandler').Logger;
define(function() {

    function Query(sql, callback) {
        executeQuery(sql, function(err, data) {
            if (err) {
                return callback(err);
            }
            callback(null, data);
        });
    }

    const pool = mysql.createPool(dbcfg.connections.dev.db);
    //const pool = mysql.createPool(dbcfg.connections.prod.db);

    const executeQuery = function(sql, callback) {
        pool.getConnection((err, connection) => {
            if (err) {
                return callback(err, null);
            } else {
                if (connection) {
                    connection.query(sql, function(error, results) {
                        connection.release();
                        if (error) {
                            logger.error('executeQuery()', error);
                            return callback(error, null);
                        } else {
                            var resResult = results[0];
                            if (resResult == undefined) {
                                const newResp = '{"status":"Failed","message":"No Data Retrived"}';
                                logger.info('data received from db', newResp);
                                return callback(null, newResp);
                            } else {
                                let res = results[0][0].responseMessage;
                                logger.info('data received from db', JSON.stringify(res));
                                return callback(null, res);
                            }
                        }

                    });
                }
            }
        });
    }

    return {
        Query: Query
    }
});