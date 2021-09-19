var define = require('node-requirejs-define'),
    tkn = require('./token'),
    jswt = require('../com.app.utils/jwtHandler'),
    rulecfg = require('../com.app.configuration/ruleConf.json'),
    validation = require('../com.app.utils/validationHandler'),
    usrDao = require('../com.app.data.access.objects/userDao'),
    bseDao = require('../com.app.data.access.objects/baseDao'),
    dispatch = require('../com.app.service.layer/dispatcher'),
    logger = require('../com.app.utils/logHandler').Logger;

define(function() {

    function Authentication(req, res, next) {
        try {
            const validationRule = rulecfg.validation.authentication;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/authentication', JSON.stringify(err));
                } else {
                    var password = jswt.HarshPassword(req.body.password),
                        session = jswt.GetSession(req.body.loginName, password),
                        jsnReq = { loginName: req.body.loginName, password: password, session: session, channel: req.body.channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/authentication', jsnDta);

                    let authUser = new usrDao(req.body.loginName, password, session, req.body.channel, jsnDta);
                    bseDao.Query(authUser.CheckUserSQL(), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);
                            switch (data.status.toLowerCase()) {
                                case "ok":
                                    switch (data.FIRST_LOGIN_STATUS.toLowerCase()) {
                                        case "f":
                                            options = { profileId: data.PROFILE_ID, loginName: data.LOGIN_NAME, firstName: data.FIRST_NAME, lastName: data.LAST_NAME, channel: req.body.channel, message: data.message, session: data.SESSION_ID, firstLoginStatus: data.FIRST_LOGIN_STATUS, twoFactorAuthStatus: data.TWO_FACTOR_AUTH_STATUS };
                                            tkn.GenerateToken(options, res);
                                            break;
                                        default:
                                            switch (data.TWO_FACTOR_AUTH_STATUS.toLowerCase()) {
                                                case "r":
                                                    options = { profileId: data.PROFILE_ID, loginName: data.LOGIN_NAME, firstName: data.FIRST_NAME, lastName: data.LAST_NAME, channel: req.body.channel, message: data.message, session: data.SESSION_ID, firstLoginStatus: data.FIRST_LOGIN_STATUS, twoFactorAuthStatus: data.TWO_FACTOR_AUTH_STATUS };
                                                    tkn.GenerateToken(options, res);
                                                    break;
                                                default:
                                                    var msgSend = { status: data.status, message: data.message, profileDetails: { profileId: data.PROFILE_ID, loginName: data.LOGIN_NAME, firstName: data.FIRST_NAME, lastName: data.LAST_NAME, session: data.SESSION_ID, firstLoginStatus: data.FIRST_LOGIN_STATUS, twoFactorAuthStatus: data.TWO_FACTOR_AUTH_STATUS } };

                                                    dispatch.SendGenricMessage(res, msgSend);
                                                    logger.info('/authentication', JSON.stringify(data));
                                                    break;
                                            }
                                            break
                                    }
                                    break;
                                default:

                                    dispatch.SendGenricMessage(res, data);
                                    logger.info('/authentication', JSON.stringify(data));
                                    break;
                            }
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/authentication', e);
            dispatch.DispatchErrorMessage(res, 'application error in Authentication()..');
        }
    }

    return {
        Authentication: Authentication
    }

});