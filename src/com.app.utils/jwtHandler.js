var define = require('node-requirejs-define'),
    jswt = require('jsonwebtoken'),
    crypto = require('crypto'),
    spkeasy = require('speakeasy'),
    appcfg = require('../com.app.configuration/appConf.json'),
    dispatcher = require('../com.app.service.layer/dispatcher');

define(function() {
    var secretKey = appcfg.application.apiSettings.secretKey,
        UIKey = appcfg.application.apiSettings.uiKey,
        salt = appcfg.application.apiSettings.salt;


    function GetSession(userId, password) {
        var payLoad = {};
        payLoad.userId = userId;
        payLoad.userName = password;
        var session = jswt.sign(payLoad, secretKey, { expiresIn: appcfg.application.apiSettings.session.expiry });
        return session;
    }

    function VerifySession(session, success, failure) {
        jswt.verify(session, secretKey, function(err, decoded) {
            if (err) {
                failure();
            } else {
                success(decoded);
            }
        });
    }

    function ValidateSession(req, res, next, callback) {
        var session = req.headers['apisessionkey'];
        switch (session) {
            case undefined:
                {
                    dispatcher.SendUnAuthorizedMessage(res);
                    break;
                }
            case null:
                {
                    dispatcher.SendUnAuthorizedMessage(res);
                    break;
                }
            default:
                {
                    sessionAuth(req, res, next, callback);
                }
        }
    }

    const sessionAuth = function(req, res, next, callback) {
        var session = req.headers['apisessionkey'];
        VerifySession(session, function(decoded) {
            req['payload'] = JSON.parse(JSON.stringify(decoded));
            callback(req, res, next);
        }, function() {
            dispatcher.SendUnAuthorizedMessage(res);
        });
    }

    function ValidateChannel(req, res, next, callback) {
        var channelKey = req.headers['channelkey'],
            uiKey = req.headers['uikey'];
        if (uiKey !== UIKey) {
            validateChannelToken(channelKey, req, res, next, callback);
        } else {
            callback(req, res, next, callback);
        }
    }

    const validateChannelToken = function(channelKey, req, res, next, callback) {
        switch (channelKey) {
            case undefined:
                {
                    dispatcher.SendUnAuthorizedMessage(res);
                    break;
                }
            case null:
                {
                    dispatcher.SendUnAuthorizedMessage(res);
                    break;
                }
            case baseChannelKey:
                {
                    callback(req, res, next, callback);
                    break;
                }
            default:
                {
                    dispatcher.SendUnAuthorizedMessage(res);
                }
        }
    }

    function JwtSign(userId) {
        var payLoad = {};
        payLoad.userId = userId;
        var token = jswt.sign(payLoad, secretKey);
        return token;
    }

    function JwtVerifySign(token, callback) {
        jswt.verify(token, secretKey, function(err, decoded) {
            if (err) {
                callback(err.message, null);
            } else {
                callback(null, decoded);
            }
        });
    }

    function GetToken() {
        let token = spkeasy.totp({
            "secret": process.env.OTP_KEY,
            "encoding": 'base32',
            "digits": appcfg.application.tokenSettings.digits,
            "step": appcfg.application.tokenSettings.step,
            "window": appcfg.application.tokenSettings.window
        });
        return token;
    }

    function VerifyToken(token) {
        var verified = spkeasy.totp.verify({
            secret: process.env.OTP_KEY,
            encoding: 'base32',
            token: token,
            step: appcfg.application.tokenSettings.step,
            window: appcfg.application.tokenSettings.window
        });
        return verified;
    }

    function HarshPassword(password) {
        // Hashing user's salt and password with 1000 iterations,
        //64 length and sha512 digest
        var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        return hash;
    };

    function UnharshPassword(password) {
        var clear = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        return clear;
    };

    return {
        GetSession: GetSession,
        VerifySession: VerifySession,
        ValidateSession: ValidateSession,
        ValidateChannel: ValidateChannel,
        JwtSign: JwtSign,
        JwtVerifySign: JwtVerifySign,
        GetToken: GetToken,
        VerifyToken: VerifyToken,
        HarshPassword: HarshPassword
    }
});