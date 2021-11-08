var define = require("node-requirejs-define"),
  rulecfg = require("../com.app.configuration/ruleConf.json"),
  validation = require("../com.app.utils/validationHandler"),
  usrDao = require("../com.app.data.access.objects/userDao"),
  bseDao = require("../com.app.data.access.objects/baseDao"),
  dispatch = require("../com.app.service.layer/dispatcher"),
  logger = require("../com.app.utils/logHandler").Logger;

define(function () {
  function GetUserbyID(req, res, next) {
    let gt_user = {
      session: req.headers["apisessionkey"],
      userId: req.body.id,
    };
    bseDao.Query(usrDao.GetUserbyIDSQL(gt_user), (err, resp) => {
      if (err) {
        dispatch.SendDataBaseErrorMessage(res, err);
      } else {
        var data = JSON.parse(resp);

        dispatch.SendGenricMessage(res, data.userData);
        logger.info("/getUserbyID", JSON.stringify(data));
      }
    });
  }

  function GetUserbyStudentNumber(req, res, next) {
    let gt_user = {
      session: req.headers["apisessionkey"],
      studentNumber: req.body.studentNr,
    };
    bseDao.Query(usrDao.GetUserbyStudentNumberSQL(gt_user), (err, resp) => {
      if (err) {
        dispatch.SendDataBaseErrorMessage(res, err);
      } else {
        var data = JSON.parse(resp);

        dispatch.SendGenricMessage(res, data.userData);
        logger.info("/getUserbyStudentNumber", JSON.stringify(data));
      }
    });
  }

  function GetStudentModules(req, res, next) {
    let gt_user = {
      session: req.headers["apisessionkey"],
      userId: req.body.id,
    };
    bseDao.Query(usrDao.GetStudentModulesSQL(gt_user), (err, resp) => {
      if (err) {
        dispatch.SendDataBaseErrorMessage(res, err);
      } else {
        var data = JSON.parse(resp);

        dispatch.SendGenricMessage(res, data.moduleData);
        logger.info("/getStudentModules", JSON.stringify(data));
      }
    });
  }

  function GetStudentDueDates(req, res, next) {
    let gt_user = {
      session: req.headers["apisessionkey"],
      userId: req.body.id,
    };
    bseDao.Query(usrDao.GetStudentDueDatesSQL(gt_user), (err, resp) => {
      if (err) {
        dispatch.SendDataBaseErrorMessage(res, err);
      } else {
        var data = JSON.parse(resp);

        dispatch.SendGenricMessage(res, data.eventData);
        logger.info("/getStudentDueDates", JSON.stringify(data));
      }
    });
  }

  function GetYearlyTuition(req, res, next) {
    let gt_user = {
      session: req.headers["apisessionkey"],
      userId: req.body.id,
    };
    bseDao.Query(usrDao.GetYearlyTuitionSQL(gt_user), (err, resp) => {
      if (err) {
        dispatch.SendDataBaseErrorMessage(res, err);
      } else {
        var data = JSON.parse(resp);

        dispatch.SendGenricMessage(res, data.moduleData);
        logger.info("/getYearlyTuition", JSON.stringify(data));
      }
    });
  }

  function AddUser(req, res, next) {
    try {
      const validationRule = rulecfg.validation.addUser;
      validation.Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
          dispatch.SendBadRequestMessage(res, err);
          logger.error("/addUser", JSON.stringify(err));
        } else {
          var jsnReq = {
              session: req.headers["apisessionkey"],
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.emailAddress,
              phone: req.body.phoneNumber,
              password: req.body.userPassword,
              studentNumber: req.body.studentNumber,
            },
            jsnDta = JSON.stringify(jsnReq);

          logger.info("/addUser", jsnDta);

          let up_user = {
            session: req.headers["apisessionkey"],
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.emailAddress,
            phone: req.body.phoneNumber,
            password: req.body.pword,
            studentNumber: req.body.studentNumber,
            jsonData: jsnDta,
          };
          bseDao.Query(usrDao.AddUserIDSQL(up_user), (err, resp) => {
            if (err) {
              dispatch.SendDataBaseErrorMessage(res, err);
            } else {
              var data = JSON.parse(resp);

              dispatch.SendGenricMessage(res, data.userData);
              logger.info("/addUser", JSON.stringify(data));
            }
          });
        }
      });
    } catch (e) {
      logger.error("/addUser", e);
      dispatch.DispatchErrorMessage(res, "application error in addUser()..");
    }
  }

  function UpdateUser(req, res, next) {
    try {
      const validationRule = rulecfg.validation.userUpdate;
      validation.Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
          dispatch.SendBadRequestMessage(res, err);
          logger.error("/updateUser", JSON.stringify(err));
        } else {
          var jsnReq = {
              userId: req.body.userId,
              session: req.headers["apisessionkey"],
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.emailAddress,
              phone: req.body.phoneNumber,
            },
            jsnDta = JSON.stringify(jsnReq);

          logger.info("/updateUser", jsnDta);

          let up_user = {
            userId: req.body.userId,
            session: req.headers["apisessionkey"],
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.emailAddress,
            phone: req.body.phoneNumber,
            jsonData: jsnDta,
          };
          bseDao.Query(usrDao.UpdateUserByIDSQL(up_user), (err, resp) => {
            if (err) {
              dispatch.SendDataBaseErrorMessage(res, err);
            } else {
              var data = JSON.parse(resp);

              dispatch.SendGenricMessage(res, data.userData);
              logger.info("/updateUser", JSON.stringify(data));
            }
          });
        }
      });
    } catch (e) {
      logger.error("/updateUser", e);
      dispatch.DispatchErrorMessage(res, "application error in UpdateUser()..");
    }
  }

  function UpdateStudentInfo(req, res, next) {
    try {
      const validationRule = rulecfg.validation.userUpdate;
      validation.Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
          dispatch.SendBadRequestMessage(res, err);
          logger.error("/updateStudentInfo", JSON.stringify(err));
        } else {
          var jsnReq = {
              userId: req.body.userId,
              session: req.headers["apisessionkey"],
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              preffName: req.body.preffName,
              email: req.body.emailAddress,
              phone: req.body.phoneNumber,
              address1: req.body.address1,
              address2: req.body.address2,
              country: req.body.country,
              postalCode: req.body.postalCode,
            },
            jsnDta = JSON.stringify(jsnReq);

          logger.info("/updateStudentInfo", jsnDta);

          let up_user = {
            userId: req.body.userId,
            session: req.headers["apisessionkey"],
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            preffName: req.body.preffName,
            email: req.body.emailAddress,
            phone: req.body.phoneNumber,
            address1: req.body.address1,
            address2: req.body.address2,
            country: req.body.country,
            postalCode: req.body.postalCode,
            jsonData: jsnDta,
          };
          bseDao.Query(usrDao.UpdateStudentInfoSQL(up_user), (err, resp) => {
            if (err) {
              dispatch.SendDataBaseErrorMessage(res, err);
            } else {
              var data = JSON.parse(resp);

              dispatch.SendGenricMessage(res, data);
              logger.info("/updateStudentInfo", JSON.stringify(data));
            }
          });
        }
      });
    } catch (e) {
      logger.error("/updateStudentInfo", e);
      dispatch.DispatchErrorMessage(
        res,
        "application error in UpdateStudentInfo().."
      );
    }
  }

  function UpdateSponsorInfo(req, res, next) {
    try {
      const validationRule = rulecfg.validation.userUpdate;
      validation.Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
          dispatch.SendBadRequestMessage(res, err);
          logger.error("/updateSponsorInfo", JSON.stringify(err));
        } else {
          var jsnReq = {
              userId: req.body.userId,
              session: req.headers["apisessionkey"],
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.emailAddress,
              phone: req.body.phoneNumber,
              address1: req.body.address1,
              address2: req.body.address2,
              country: req.body.country,
            },
            jsnDta = JSON.stringify(jsnReq);

          logger.info("/updateSponsorInfo", jsnDta);

          let up_user = {
            userId: req.body.userId,
            session: req.headers["apisessionkey"],
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.emailAddress,
            phone: req.body.phoneNumber,
            address1: req.body.address1,
            address2: req.body.address2,
            country: req.body.country,
            jsonData: jsnDta,
          };
          bseDao.Query(usrDao.UpdateSponsorInfoSQL(up_user), (err, resp) => {
            if (err) {
              dispatch.SendDataBaseErrorMessage(res, err);
            } else {
              var data = JSON.parse(resp);

              dispatch.SendGenricMessage(res, data);
              logger.info("/updateSponsorInfo", JSON.stringify(data));
            }
          });
        }
      });
    } catch (e) {
      logger.error("/updateSponsorInfo", e);
      dispatch.DispatchErrorMessage(
        res,
        "application error in UpdateSponsorInfo().."
      );
    }
  }

  function UpdateAdditionalContactInfo(req, res, next) {
    try {
      const validationRule = rulecfg.validation.userUpdate;
      validation.Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
          dispatch.SendBadRequestMessage(res, err);
          logger.error("/updateAdditionalContactInfo", JSON.stringify(err));
        } else {
          var jsnReq = {
              userId: req.body.userId,
              session: req.headers["apisessionkey"],
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.emailAddress,
              phone: req.body.phoneNumber,
              country: req.body.country,
            },
            jsnDta = JSON.stringify(jsnReq);

          logger.info("/updateAdditionalContactInfo", jsnDta);

          let up_user = {
            userId: req.body.userId,
            session: req.headers["apisessionkey"],
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.emailAddress,
            phone: req.body.phoneNumber,
            country: req.body.country,
            jsonData: jsnDta,
          };
          bseDao.Query(
            usrDao.UpdateAdditionalContactInfoSQL(up_user),
            (err, resp) => {
              if (err) {
                dispatch.SendDataBaseErrorMessage(res, err);
              } else {
                var data = JSON.parse(resp);

                dispatch.SendGenricMessage(res, data);
                logger.info(
                  "/updateAdditionalContactInfo",
                  JSON.stringify(data)
                );
              }
            }
          );
        }
      });
    } catch (e) {
      logger.error("/updateAdditionalContactInfo", e);
      dispatch.DispatchErrorMessage(
        res,
        "application error in UpdateAdditionalContactInfo().."
      );
    }
  }

  function TwoFactorAuth(req, res, next) {
    try {
      const validationRule = rulecfg.validation.userTwoFactorAuth;
      validation.Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
          dispatch.SendBadRequestMessage(res, err);
          logger.error("/twoFactorAuth", JSON.stringify(err));
        } else {
          var jsnReq = {
              profileId: req.body.profileId,
              session: req.headers["apisessionkey"],
              status: req.body.status,
              channel: req.body.channel,
            },
            jsnDta = JSON.stringify(jsnReq);

          logger.info("/twoFactorAuth", jsnDta);

          let tfa = {
            profileId: req.body.profileId,
            session: req.headers["apisessionkey"],
            status: req.body.status,
            channel: req.body.channel,
            jsonData: jsnDta,
          };
          bseDao.Query(usrDao.UpdateUser2FaSQL(tfa), (err, resp) => {
            if (err) {
              dispatch.SendDataBaseErrorMessage(res, err);
            } else {
              var data = JSON.parse(resp);

              dispatch.SendGenricMessage(res, data);
              logger.info("/twoFactorAuth", JSON.stringify(data));
            }
          });
        }
      });
    } catch (e) {
      logger.error("/twoFactorAuth", e);
      dispatch.DispatchErrorMessage(
        res,
        "application error in TwoFactorAuth().."
      );
    }
  }

  return {
    GetUserbyID: GetUserbyID,
    GetUserbyStudentNumber: GetUserbyStudentNumber,
    GetStudentModules: GetStudentModules,
    GetStudentDueDates: GetStudentDueDates,
    GetYearlyTuition: GetYearlyTuition,
    AddUser: AddUser,
    UpdateUser: UpdateUser,
    UpdateStudentInfo: UpdateStudentInfo,
    UpdateSponsorInfo: UpdateSponsorInfo,
    UpdateAdditionalContactInfo: UpdateAdditionalContactInfo,
    TwoFactorAuth: TwoFactorAuth,
  };
});
