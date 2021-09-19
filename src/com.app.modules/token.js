var define = require('node-requirejs-define'),
    sesion = require('./session'),
    msg = require('../com.app.utils/messageHandler'),
    jswt = require('../com.app.utils/jwtHandler'),
    rulecfg = require('../com.app.configuration/ruleConf.json'),
    validation = require('../com.app.utils/validationHandler'),
    tknDao = require('../com.app.data.access.objects/tokenDao'),
    dispatch = require('../com.app.service.layer/dispatcher'),
    bseDao = require('../com.app.data.access.objects/baseDao'),
    logger = require('../com.app.utils/logHandler').Logger;

define(function() {

    function GenerateToken(obj, res) {
        try {
            var profileId = obj.profileId,
                token = jswt.GetToken(),
                channel = obj.channel,
                jsnReq = { profileId: obj.profileId, token: token, channel: channel },
                jsnDta = JSON.stringify(jsnReq);

            logger.info('GenerateToken()', jsnDta);

            let genTkn = new tknDao(profileId, token, channel, jsnDta)
            bseDao.Query(genTkn.GetCreateTokenSQL(), (err, resp) => {
                if (err) {
                    dispatch.SendDataBaseErrorMessage(res, err);
                } else {
                    var options = { email: obj.loginName, name: obj.firstName + ' ' + obj.lastName, token: token };
                    msg.SendTokenMsg(options);

                    var msgSend = { status: 'OK', message: 'Login Successful!', profileDetails: { profileId: obj.profileId, loginName: obj.loginName, firstName: obj.firstName, lastName: obj.lastName, message: obj.message, session: obj.session, firstLoginStatus: obj.firstLoginStatus, twoFactorAuthStatus: obj.twoFactorAuthStatus } };

                    dispatch.SendGenricMessage(res, msgSend);
                    logger.info('GenerateToken()', JSON.stringify(msgSend));
                }
            });
        } catch (e) {
            logger.error('GenerateToken()', e);
            dispatch.DispatchErrorMessage(res, 'application error in GenerateToken()..');
        }
    }

    function ResendToken(req, res, next) {
        try {
            const validationRule = rulecfg.validation.resendToken;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/resendToken', JSON.stringify(err));
                } else {
                    var profileId = req.body.profileId,
                        token = jswt.GetToken(),
                        loginName = req.body.loginName,
                        channel = req.body.channel,
                        jsnReq = { profileId: profileId, token: token, loginName: loginName, channel: channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/resendToken', jsnDta);

                    let genTkn = new tknDao(profileId, token, channel, jsnDta);
                    bseDao.Query(genTkn.GetCreateTokenSQL(), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);
                            switch (data.status.toLowerCase()) {
                                case "ok":
                                    var options = { email: loginName, name: data.Name, token: token };
                                    msg.SendTokenMsg(options);

                                    dispatch.SendGenricMessage(res, data);
                                    logger.info('/resendToken', JSON.stringify(data));
                                    break;
                                default:
                                    dispatch.SendGenricMessage(res, data);
                                    logger.info('/resendToken', JSON.stringify(data));
                                    break;
                            }
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/resendToken', e);
            dispatch.DispatchErrorMessage(res, 'application error in ResendToken()..');
        }
    }

    function ValidateToken(req, res, next) {
        try {
            const validationRule = rulecfg.validation.validateToken;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/validateToken', JSON.stringify(err));
                } else {
                    var profileId = req.body.profileId,
                        token = req.body.token,
                        channel = req.body.channel;

                    var tokenStatus;
                    tokenIsValid = jswt.VerifyToken(token);
                    switch (tokenIsValid) {
                        case true:
                            tokenStatus = 'A';
                            break;
                        case false:
                            tokenStatus = 'D';
                            break;
                    }

                    var jsnReq = { profileId: profileId, token: token, tokenIsValid: tokenIsValid, tokenStatus: tokenStatus },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/validateToken', jsnDta);

                    let tkn_auth = { profileId: profileId, token: token, status: tokenStatus, jsonData: jsnDta };
                    bseDao.Query(tknDao.GetValidateTokenSQL(tkn_auth), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);
                            switch (data.status.toLowerCase()) {
                                case "ok":
                                    var obj = { profileId: profileId, token: token, channel: channel };
                                    sesion.SessionMgt(obj, res);
                                    break;
                                default:
                                    dispatch.SendGenricMessage(res, data);
                                    logger.info('/validateToken', JSON.stringify(data));
                                    break;
                            }
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/validateToken', e);
            dispatch.DispatchErrorMessage(res, 'application error in ValidateToken()..');
        }
    }

    return {
        GenerateToken: GenerateToken,
        ResendToken: ResendToken,
        ValidateToken: ValidateToken
    }
});