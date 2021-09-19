var define = require('node-requirejs-define'),
    rulecfg = require('../com.app.configuration/ruleConf.json'),
    validation = require('../com.app.utils/validationHandler'),
    bnkDao = require('../com.app.data.access.objects/bankDao'),
    bseDao = require('../com.app.data.access.objects/baseDao'),
    dispatch = require('../com.app.service.layer/dispatcher'),
    logger = require('../com.app.utils/logHandler').Logger;

define(function() {

    function GetBank(req, res, next) {
        try {
            const validationRule = rulecfg.validation.bankGet;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/getBank', JSON.stringify(err));
                } else {
                    var jsnReq = { profileId: req.body.profileId, session: req.headers['apisessionkey'], channel: req.body.channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/getBank', jsnDta);

                    let gt_user = { profileId: req.body.profileId, session: req.headers['apisessionkey'], channel: req.body.channel, jsonData: jsnDta };
                    bseDao.Query(bnkDao.GetBankSQL(gt_user), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);

                            dispatch.SendGenricMessage(res, data);
                            logger.info('/getBank', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/getBank', e);
            dispatch.DispatchErrorMessage(res, 'application error in GetBank()..');
        }
    }

    function CreateBank(req, res, next) {
        try {
            const validationRule = rulecfg.validation.bankCreate;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/createBank', JSON.stringify(err));
                } else {
                    var jsnReq = { profileId: req.body.profileId, session: req.headers['apisessionkey'], bnkName: req.body.bankName, accNumber: parseInt(req.body.accountNumber), accName: req.body.accountName, channel: req.body.channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/createBank', jsnDta);

                    let bank = new bnkDao(req.body.profileId, req.headers['apisessionkey'], req.body.bankName, parseInt(req.body.accountNumber), req.body.accountName, req.body.channel, jsnDta)
                    bseDao.Query(bank.RegisterBankSQL(bank), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);

                            dispatch.SendGenricMessage(res, data);
                            logger.info('/createBank', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/createBank', e);
            dispatch.DispatchErrorMessage(res, 'application error in CreateBank()..');
        }
    }

    function UpdateBank(req, res, next) {
        try {
            const validationRule = rulecfg.validation.bankUpdate;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/updateBank', JSON.stringify(err));
                } else {
                    var jsnReq = { profileId: req.body.profileId, session: req.headers['apisessionkey'], bankId: req.body.bankId, bnkName: req.body.bankName, accNumber: parseInt(req.body.accountNumber), accName: req.body.accountName, channel: req.body.channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/updateBank', jsnDta);

                    let up_user = { profileId: req.body.profileId, session: req.headers['apisessionkey'], bankId: req.body.bankId, bnkName: req.body.bankName, accNumber: req.body.accountNumber, accName: req.body.accountName, channel: req.body.channel, jsonData: jsnDta };
                    bseDao.Query(bnkDao.UpdateBankByIdSQL(up_user), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);

                            dispatch.SendGenricMessage(res, data);
                            logger.info('/updateBank', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/updateBank', e);
            dispatch.DispatchErrorMessage(res, 'application error in UpdateBank()..');
        }
    }

    return {
        GetBank: GetBank,
        CreateBank: CreateBank,
        UpdateBank: UpdateBank
    }

});