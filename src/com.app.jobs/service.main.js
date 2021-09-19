var define = require('node-requirejs-define'),
    cron = require('node-cron'),
    smsServ = require('../com.app.services/smsService');

define(function() {
    cron.schedule('*/2 * * * *', function() {
        console.log('Crone Job running at ' + new Date());
        smsServ.main();
    });
});