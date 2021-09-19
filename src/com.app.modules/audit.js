var define = require('node-requirejs-define'),
    rulecfg = require('../com.app.configuration/ruleConf.json'),
    appcfg = require('../com.app.configuration/appConf.json'),
    validation = require('../com.app.utils/validationHandler'),
    audDao = require('../com.app.data.access.objects/auditDao'),
    bseDao = require('../com.app.data.access.objects/baseDao'),
    dispatch = require('../com.app.service.layer/dispatcher'),
    logger = require('../com.app.utils/logHandler').Logger;

define(function() {

    function GetAudit(req, res, next) {
        try {
            const validationRule = rulecfg.validation.auditGet;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/getAudit', JSON.stringify(err));
                } else {
                    var profileId = req.body.profileId,
                        session = req.headers['apisessionkey'],
                        userId = req.body.userId,
                        startDate = req.body.startDate + appcfg.application.timeSettings.startTimeStamp,
                        endDate = req.body.endDate + appcfg.application.timeSettings.endTimeStamp,
                        channel = req.body.channel,
                        jsnReq = { profileId: profileId, session: session, userId: userId, startDate: startDate, endDate: endDate, channel: channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/getAudit', jsnDta);

                    let audit = new audDao(profileId, session, userId, startDate, endDate, channel, jsnDta);
                    bseDao.Query(audit.GetAuditSQL(), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            dispatch.SendGenricMessage(res, resp);
                            logger.info('/getAudit', resp);
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/getAudit', e);
            dispatch.DispatchErrorMessage(res, 'application error in GetAudit()..');
        }
    }

    function GetUserAudit(req, res, next) {
        try {
            const validationRule = rulecfg.validation.auditUser;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/getUserAudit', JSON.stringify(err));
                } else {
                    var profileId = req.body.profileId,
                        session = req.headers['apisessionkey'],
                        startDate = req.body.startDate + appcfg.application.timeSettings.startTimeStamp,
                        endDate = req.body.endDate + appcfg.application.timeSettings.endTimeStamp,
                        channel = req.body.channel,
                        jsnReq = { profileId: profileId, session: session, startDate: startDate, endDate: endDate, channel: channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/getUserAudit', jsnDta);

                    let usr_audit = { profileId: profileId, session: session, startDate: startDate, endDate: endDate, channel: channel, jsonData: jsnDta };
                    bseDao.Query(audDao.GetUserAuditSQL(usr_audit), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            dispatch.SendGenricMessage(res, resp);
                            logger.info('/getUserAudit', resp);
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/getUserAudit', e);
            dispatch.DispatchErrorMessage(res, 'application error in GetUserAudit()..');
        }
    }

    return {
        GetAudit: GetAudit,
        GetUserAudit: GetUserAudit
    }

});