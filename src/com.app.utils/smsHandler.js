var define = require('node-requirejs-define'),
    appcfg = require('../com.app.configuration/appConf.json');

define(function() {
    const request = require('request');
    const url = appcfg.application.smsSettings.url;
    const auth = appcfg.application.smsSettings.auth;
    var user = appcfg.application.smsSettings.user;
    var password = appcfg.application.smsSettings.password;

    var base64encodedData = Buffer.from(user + ':' + password).toString('base64');

    function SendSms(phone, message, callback, errorMain, messageId) {
        console.log('sending message to phone number: ' + phone + ' context is: ' + message);
        var postData = [{
            "from": appcfg.application.smsSettings.from,
            "to": phone,
            "routingGroup": appcfg.application.smsSettings.routingGroup,
            "encoding": appcfg.application.smsSettings.encoding,
            "longMessageMaxParts": appcfg.application.smsSettings.longMessageMaxParts,
            "body": message,
            "userSuppliedId": appcfg.application.smsSettings.userSuppliedId,
            "protocolId": appcfg.application.smsSettings.protocolId,
            "deliveryReports": appcfg.application.smsSettings.deliveryReports,
        }]
        var options = {
            url: url,
            headers: {
                'Authorization': 'Basic ' + base64encodedData
            },
            method: 'POST',
            json: postData
        };
        request(options, function(error, response, body) {
            console.log('*****sms gateway response begin ****');
            console.log(response);
            if ((null === error) && (response.statusCode.toString() !== '403')) {
                console.log(response);
                callback(body, messageId);
            } else {
                console.log('error' + error);
                if (typeof errorMain !== 'undefined') {
                    errorMain(error, messageId)
                }
            }
        });
    }

    function SendDummySms(phone, message, callback, errorMain) {
        setTimeout(function() {
            callback({});
            // errorMain("");
        }, 5000);
    }

    return {
        SendSms: SendSms,
        SendDummySms: SendDummySms
    }

});