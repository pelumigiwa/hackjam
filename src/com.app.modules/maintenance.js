var define = require('node-requirejs-define'),
    msg = require('../com.app.utils/messageHandler'),
    jswt = require('../com.app.utils/jwtHandler'),
    appcfg = require('../com.app.configuration/appConf.json'),
    rulecfg = require('../com.app.configuration/ruleConf.json'),
    validation = require('../com.app.utils/validationHandler'),
    maintenanceDAO = require('../com.app.data.access.objects/maintenanceDao'),
    bseDao = require('../com.app.data.access.objects/baseDao'),
    dispatch = require('../com.app.service.layer/dispatcher'),
    logger = require('../com.app.utils/logHandler').Logger;

define(function() {

    function ChangePassword(req, res, next) {
        try {
            const validationRule = rulecfg.validation.changePassword;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/changePassword', JSON.stringify(err));
                } else {
                    var profileId = req.body.profileId,
                        session = req.headers['apisessionkey'],
                        oldPass = jswt.HarshPassword(req.body.oldPassword),
                        newPass = jswt.HarshPassword(req.body.newPassword),
                        channel = req.body.channel,
                        jsnReq = { profileId: profileId, session: session, oldPassword: oldPass, newPassword: newPass, channel: channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/changePassword', jsnDta);

                    let psswd_change = new maintenanceDAO(profileId, session, oldPass, newPass, channel, jsnDta);
                    bseDao.Query(psswd_change.GetChangePasswordSQL(), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);
                            dispatch.SendGenricMessage(res, data);
                            logger.info('/changePassword', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/changePassword', e);
            dispatch.DispatchErrorMessage(res, 'application error in ChangePassword()..');
        }
    }

    function ForgotPassword(req, res, next) {
        try {
            const validationRule = rulecfg.validation.forgotPassword;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/forgotPassword', JSON.stringify(err));
                } else {
                    var email = req.body.loginName,
                        channel = req.body.channel,
                        jsnReq = { email: email, channel: channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/forgotPassword', jsnDta);

                    let psswd_forgot = { loginName: email, channel: channel, jsonData: jsnDta };
                    bseDao.Query(maintenanceDAO.GetForgotPasswordSQL(psswd_forgot), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);
                            switch (data.status.toLowerCase()) {
                                case "ok":
                                    var resetPssdLink = jswt.JwtSign(email);
                                    var options = { resetLink: resetPssdLink, email: email, name: data.CustomerFirstName };
                                    msg.SendResetPasswordEmailMsg(options);
                                    dispatch.DispatchSuccessMessage(res, appcfg.application.forgotPassword.notice)
                                    break;
                                default:
                                    dispatch.SendGenricMessage(res, data);
                                    logger.info('/forgotPassword', JSON.stringify(data));
                                    break;
                            }
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/forgotPassword', e);
            dispatch.DispatchErrorMessage(res, 'application error in ForgotPassword()..');
        }
    }

    function ResetPassword(req, res, next) {
        try {
            const validationRule = rulecfg.validation.resetPassword;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/resetPassword', JSON.stringify(err));
                } else {
                    var newPass = jswt.HarshPassword(req.body.password),
                        token = req.body.resetToken,
                        channel = req.body.channel,
                        jsnReq = { newPass: newPass, token: token, channel: channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/resetPassword', jsnDta);

                    jswt.JwtVerifySign(token, (err, resp) => {
                        if (err) {
                            var json = { status: "Failed", message: err }
                            dispatch.SendGenricMessage(res, json);
                            logger.error('/resetPassword', JSON.stringify(err));
                        } else {
                            var jsnReq = { email: resp.userId, channel: channel },
                                jsnDta = JSON.stringify(jsnReq);

                            let psswd_reset = { email: token, newPass: newPass, channel: channel, jsonData: jsnDta };
                            bseDao.Query(maintenanceDAO.GetResetPasswordSQL(psswd_reset), (err, resp) => {
                                if (err) {
                                    dispatch.SendDataBaseErrorMessage(res, err);
                                } else {
                                    var data = JSON.parse(resp);
                                    dispatch.SendGenricMessage(res, data);
                                    logger.info('/resetPassword', JSON.stringify(data));
                                }
                            });
                        }
                    })
                }
            });
        } catch (e) {
            logger.error('/resetPassword', e);
            dispatch.DispatchErrorMessage(res, 'application error in ResetPassword()..');
        }
    }

    return {
        ChangePassword: ChangePassword,
        ForgotPassword: ForgotPassword,
        ResetPassword: ResetPassword
    }
});