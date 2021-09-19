var define = require('node-requirejs-define'),
    appcfg = require('../com.app.configuration/appConf');

define(function() {

    function DispatchSuccessMessage(res, message, data) {
        var userResponse = ((data !== undefined) ? data : {});
        userResponse.status = 'OK';
        userResponse.message = message;
        res.send(userResponse);
    }

    function DispatchErrorMessage(res, message, data) {
        var userResponse = ((data !== undefined) ? data : {});
        userResponse.status = 'ERROR';
        userResponse.message = message;
        res.send(userResponse);
    }

    function SendUnAuthorizedMessage(res, data) {
        var userResponse = ((data !== undefined) ? data : {});
        userResponse.status = appcfg.error.forbidden.description; //'FORBIDDEN';
        userResponse.message = appcfg.error.forbidden.message; //'Unauthorised access, new session required';
        res.send(userResponse);
    }

    function SendBadRequestMessage(res, err) {
        res.status(400).json({
            data: {
                code: appcfg.error.badRequest.code,
                status: appcfg.error.badRequest.description,
                message: err
            }
        });
    }

    function SendDataBaseErrorMessage(res, err) {
        res.status(400).json({
            data: {
                code: appcfg.error.dataBaseError.code,
                status: appcfg.error.dataBaseError.description,
                message: err
            }
        });
    }

    function SendGenricMessage(res, data) {
        res.status(200).json({
            data
        });
    }

    return {
        DispatchSuccessMessage: DispatchSuccessMessage,
        DispatchErrorMessage: DispatchErrorMessage,
        SendUnAuthorizedMessage: SendUnAuthorizedMessage,
        SendBadRequestMessage: SendBadRequestMessage,
        SendDataBaseErrorMessage: SendDataBaseErrorMessage,
        SendGenricMessage: SendGenricMessage
    }
});