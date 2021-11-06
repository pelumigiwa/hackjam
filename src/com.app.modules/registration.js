var define = require("node-requirejs-define"),
  jswt = require("../com.app.utils/jwtHandler"),
  msg = require("../com.app.utils/messageHandler"),
  rulecfg = require("../com.app.configuration/ruleConf.json"),
  validation = require("../com.app.utils/validationHandler"),
  regDao = require("../com.app.data.access.objects/registrationDao"),
  bseDao = require("../com.app.data.access.objects/baseDao"),
  dispatch = require("../com.app.service.layer/dispatcher"),
  logger = require("../com.app.utils/logHandler").Logger;

define(function () {
  function Registration(req, res, next) {
    try {
      const validationRule = rulecfg.validation.registration;
      validation.Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
          dispatch.SendBadRequestMessage(res, err);
          logger.error("/registration", JSON.stringify(err));
        } else {
          var password = jswt.HarshPassword(req.body.password),
            jsnReq = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              emailAddress: req.body.emailAddress,
              phoneNumber: req.body.phoneNumber,
              password: password,
              channel: req.body.channel,
            },
            jsnDta = JSON.stringify(jsnReq);

          logger.info("/registration", jsnDta);

          let regUser = new regDao(
            req.body.firstName,
            req.body.lastName,
            req.body.emailAddress,
            req.body.phoneNumber,
            password,
            req.body.channel,
            jsnDta
          );
          bseDao.Query(regUser.RegisterUserSQL(), (err, resp) => {
            if (err) {
              dispatch.SendDataBaseErrorMessage(res, err);
            } else {
              var data = JSON.parse(resp);
              switch (data.status.toLowerCase()) {
                case "ok":
                  var verifyLink = jswt.JwtSign(req.body.emailAddress),
                    options = {
                      header: "Email Verification",
                      email: req.body.emailAddress,
                      name: data.CustomerFirstName,
                      link: verifyLink,
                    };
                  msg.SendIndividualCreationMsg(options);

                  dispatch.SendGenricMessage(res, data);
                  logger.info("/registration", JSON.stringify(data));
                  break;
                default:
                  dispatch.SendGenricMessage(res, data);
                  logger.info("/registration", JSON.stringify(data));
                  break;
              }
            }
          });
        }
      });
    } catch (e) {
      logger.error("/registration", e);
      dispatch.DispatchErrorMessage(
        res,
        "application error in Registration().."
      );
    }
  }

  function RegistrationVerification(req, res, next) {
    try {
      const validationRule = rulecfg.validation.registerVerify;
      validation.Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
          dispatch.SendBadRequestMessage(res, err);
          logger.error("/registrationVerification", JSON.stringify(err));
        } else {
          var token = req.body.token,
            channel = req.body.channel;

          jswt.JwtVerifySign(token, (err, resp) => {
            if (err) {
              var json = { status: "Failed", message: err };
              dispatch.SendGenricMessage(res, json);
              logger.error("/registrationVerification", JSON.stringify(err));
            } else {
              var jsnReq = { token: resp.userId, channel: channel },
                jsnDta = JSON.stringify(jsnReq);

              let mail_auth = {
                token: resp.userId,
                channel: channel,
                jsonData: jsnDta,
              };
              bseDao.Query(regDao.GetVerifyEmailSQL(mail_auth), (err, resp) => {
                if (err) {
                  dispatch.SendDataBaseErrorMessage(res, err);
                } else {
                  var data = JSON.parse(resp);
                  dispatch.SendGenricMessage(res, data);
                  logger.info(
                    "/registrationVerification",
                    JSON.stringify(data)
                  );
                }
              });
            }
          });
        }
      });
    } catch (e) {
      logger.error("/registrationVerification", e);
      dispatch.DispatchErrorMessage(
        res,
        "application error in RegistrationVerification().."
      );
    }
  }

  return {
    Registration: Registration,
    RegistrationVerification: RegistrationVerification,
  };
});
