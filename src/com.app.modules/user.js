var define = require('node-requirejs-define'),
    rulecfg = require('../com.app.configuration/ruleConf.json'),
    validation = require('../com.app.utils/validationHandler'),
    usrDao = require('../com.app.data.access.objects/userDao'),
    bseDao = require('../com.app.data.access.objects/baseDao'),
    dispatch = require('../com.app.service.layer/dispatcher'),
    logger = require('../com.app.utils/logHandler').Logger;

define(function() {

    function GetUser(req, res, next) {
        try {
            const validationRule = rulecfg.validation.userGet;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/getUser', JSON.stringify(err));
                } else {
                    var jsnReq = { profileId: req.body.profileId, session: req.headers['apisessionkey'], channel: req.body.channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/getUser', jsnDta);

                    let gt_user = { profileId: req.body.profileId, session: req.headers['apisessionkey'], channel: req.body.channel, jsonData: jsnDta };
                    bseDao.Query(usrDao.GetUserSQL(gt_user), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);

                            dispatch.SendGenricMessage(res, data);
                            logger.info('/getUser', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/authentication', e);
            dispatch.DispatchErrorMessage(res, 'application error in GetUser()..');
        }
    }

    function UpdateUser(req, res, next) {
        try {
            const validationRule = rulecfg.validation.userUpdate;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/updateUser', JSON.stringify(err));
                } else {
                    var jsnReq = { profileId: req.body.profileId, session: req.headers['apisessionkey'], firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.emailAddress, phone: req.body.phoneNumber, channel: req.body.channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/updateUser', jsnDta);

                    let up_user = { profileId: req.body.profileId, session: req.headers['apisessionkey'], firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.emailAddress, phone: req.body.phoneNumber, channel: req.body.channel, jsonData: jsnDta };
                    bseDao.Query(usrDao.UpdateUserByIdSQL(up_user), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);

                            dispatch.SendGenricMessage(res, data);
                            logger.info('/updateUser', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/updateUser', e);
            dispatch.DispatchErrorMessage(res, 'application error in UpdateUser()..');
        }
    }

    function TwoFactorAuth(req, res, next) {
        try {
            const validationRule = rulecfg.validation.userTwoFactorAuth;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/twoFactorAuth', JSON.stringify(err));
                } else {
                    var jsnReq = { profileId: req.body.profileId, session: req.headers['apisessionkey'], status: req.body.status, channel: req.body.channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/twoFactorAuth', jsnDta);

                    let tfa = { profileId: req.body.profileId, session: req.headers['apisessionkey'], status: req.body.status, channel: req.body.channel, jsonData: jsnDta };
                    bseDao.Query(usrDao.UpdateUser2FaSQL(tfa), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);

                            dispatch.SendGenricMessage(res, data);
                            logger.info('/twoFactorAuth', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/twoFactorAuth', e);
            dispatch.DispatchErrorMessage(res, 'application error in TwoFactorAuth()..');
        }
    }

    return {
        GetUser: GetUser,
        UpdateUser: UpdateUser,
        TwoFactorAuth: TwoFactorAuth
    }

});