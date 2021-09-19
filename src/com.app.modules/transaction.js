var define = require('node-requirejs-define'),
    rulecfg = require('../com.app.configuration/ruleConf.json'),
    validation = require('../com.app.utils/validationHandler'),
    transDao = require('../com.app.data.access.objects/transactionDao'),
    bseDao = require('../com.app.data.access.objects/baseDao'),
    dispatch = require('../com.app.service.layer/dispatcher'),
    logger = require('../com.app.utils/logHandler').Logger;

define(function() {

    function GetTransaction(req, res, next) {
        try {
            const validationRule = rulecfg.validation.transactionGet;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/getTransaction', JSON.stringify(err));
                } else {
                    var jsnReq = { profileId: req.body.profileId, session: req.headers['apisessionkey'], channel: req.body.channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/getTransaction', jsnDta);

                    let gt_trans = { profileId: req.body.profileId, session: req.headers['apisessionkey'], channel: req.body.channel, jsonData: jsnDta };
                    bseDao.Query(transDao.GetTransactionSQL(gt_trans), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);

                            dispatch.SendGenricMessage(res, data);
                            logger.info('/getTransaction', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/getTransaction', e);
            dispatch.DispatchErrorMessage(res, 'application error in GetTransaction()..');
        }
    }

    function CreateTransaction(req, res, next) {
        try {
            const validationRule = rulecfg.validation.transactionCreate;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/createTransaction', JSON.stringify(err));
                } else {
                    var jsnReq = { profileId: req.body.profileId, session: req.headers['apisessionkey'], transactionReference: req.body.transactionReference, transactionDescription: req.body.transactionDescription, transactionFee: parseFloat(req.body.transactionFee), transactionAmount: parseFloat(req.body.transactionAmount), channel: req.body.channel },
                        transJson = JSON.stringify(jsnReq),
                        jsnDta = transJson;

                    logger.info('/createTransaction', jsnDta);

                    let trans = new transDao(req.body.profileId, req.headers['apisessionkey'], req.body.transactionReference, req.body.transactionDescription, parseFloat(req.body.transactionFee), parseFloat(req.body.transactionAmount), transJson, req.body.channel, jsnDta)
                    bseDao.Query(trans.CreateTransactionSQL(), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);

                            dispatch.SendGenricMessage(res, data);
                            logger.info('/createTransaction', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/createTransaction', e);
            dispatch.DispatchErrorMessage(res, 'application error in CreateTransaction()..');
        }
    }

    function GetReferenceNo(req, res, next) {
        try {
            const validationRule = rulecfg.validation.referenceGet;
            validation.Validator(req.body, validationRule, {}, (err, status) => {
                if (!status) {
                    dispatch.SendBadRequestMessage(res, err);
                    logger.error('/getReferenceNo', JSON.stringify(err));
                } else {
                    var jsnReq = { profileId: req.body.profileId, session: req.headers['apisessionkey'], channel: req.body.channel },
                        jsnDta = JSON.stringify(jsnReq);

                    logger.info('/getReferenceNo', jsnDta);

                    let gt_refNo = { profileId: req.body.profileId, session: req.headers['apisessionkey'], channel: req.body.channel, jsonData: jsnDta };
                    bseDao.Query(transDao.GetReferenceNoSQL(gt_refNo), (err, resp) => {
                        if (err) {
                            dispatch.SendDataBaseErrorMessage(res, err);
                        } else {
                            var data = JSON.parse(resp);

                            dispatch.SendGenricMessage(res, data);
                            logger.info('/getReferenceNo', JSON.stringify(data));
                        }
                    });
                }
            });
        } catch (e) {
            logger.error('/getReferenceNo', e);
            dispatch.DispatchErrorMessage(res, 'application error in GetReferenceNo()..');
        }
    }

    return {
        GetTransaction: GetTransaction,
        CreateTransaction: CreateTransaction,
        GetReferenceNo: GetReferenceNo
    }

});