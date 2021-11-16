function routerMain() {
  var express = require("express"),
    jswt = require("../com.app.utils/jwtHandler"),
    adt = require("../com.app.modules/audit"),
    auth = require("../com.app.modules/authentication"),
    errlog = require("../com.app.modules/errorLog"),
    maintain = require("../com.app.modules/maintenance"),
    register = require("../com.app.modules/registration"),
    users = require("../com.app.modules/user"),
    tkn = require("../com.app.modules/token"),
    bnk = require("../com.app.modules/bank"),
    trns = require("../com.app.modules/transaction"),
    logger = require("../com.app.utils/logHandler").Logger,
    appRouter = express.Router();

  function initRouters() {
    //audit..
    setUpSecureEndPoint("/getAudit", adt.GetAudit);
    setUpSecureEndPoint("/getUserAudit", adt.GetUserAudit);

    //authentication...
    setUpBasendPoint("/authentication", auth.Authentication);

    //error logs...
    setUpBasendPoint("/getInfolog", errlog.GetInfoLog);
    setUpBasendPoint("/getErrorlog", errlog.GetErrorLog);
    setUpBasendPoint("/getDebuglog", errlog.GetDebugLog);

    //maintenance...
    setUpSecureEndPoint("/changePassword", maintain.ChangePassword);
    setUpBasendPoint("/forgotPassword", maintain.ForgotPassword);
    setUpBasendPoint("/resetPassword", maintain.ResetPassword);

    //registration...
    setUpBasendPoint("/registration", register.Registration);
    setUpBasendPoint(
      "/registrationVerification",
      register.RegistrationVerification
    );

    //users...
    setUpBasendPoint("/getUserbyID", users.GetUserbyID);
    setUpBasendPoint("/getUserbyStudentNumber", users.GetUserbyStudentNumber);
    setUpBasendPoint("/getStudentModules", users.GetStudentModules);
    setUpBasendPoint("/getStudentDueDates", users.GetStudentDueDates);
    setUpBasendPoint("/getYearlyTuition", users.GetYearlyTuition);
    setUpBasendPoint("/addUser", users.AddUser);
    setUpBasendPoint("/updateUser", users.UpdateUser);
    setUpBasendPoint("/updateStudentInfo", users.UpdateStudentInfo);
    setUpBasendPoint("/updateSponsorInfo", users.UpdateSponsorInfo);
    setUpBasendPoint(
      "/updateAdditionalContactInfo",
      users.UpdateAdditionalContactInfo
    );
    setUpSecureEndPoint("/twoFactorAuth", users.TwoFactorAuth);

    //token...
    setUpBasendPoint("/validateToken", tkn.ValidateToken);
    setUpBasendPoint("/resendToken", tkn.ResendToken);

    //bank...
    setUpSecureEndPoint("/getBank", bnk.GetBank);
    setUpSecureEndPoint("/createBank", bnk.CreateBank);
    setUpSecureEndPoint("/updateBank", bnk.UpdateBank);

    //transaction...
    setUpSecureEndPoint("/getTransaction", trns.GetTransaction);
    setUpSecureEndPoint("/createTransaction", trns.CreateTransaction);
    setUpSecureEndPoint("/getReferenceNo", trns.GetReferenceNo);

    module.exports = appRouter;
  }

  const setUpBasendPoint = function (endpoint, action) {
    try {
      appRouter.post(endpoint, function (req, res, next) {
        jswt.ValidateChannel(req, res, next, action);
      });
    } catch (e) {
      logger.error("setUpBasendPoint", e);
    }
  };

  const setUpSecureEndPoint = function (endpoint, action) {
    try {
      appRouter.post(endpoint, function (req, res, next) {
        jswt.ValidateSession(req, res, next, action);
      });
    } catch (e) {
      logger.error("setUpSecureEndPoint", e);
    }
  };

  return {
    initRouters: initRouters,
  };
}
routerMain().initRouters();
