var define = require('node-requirejs-define'),
    mailer = require('./mailHandler'),
    mssgeModel = require('../com.app.models/messageModel');

define(function() {

    function SendIndividualCreationMsg(options) {
        var context = mssgeModel.GetIndividualCreationMsg(options, 'email');
        mailer.SendMail(options.email, options.header, context);
    }

    function SendOthersCreationMsg(options) {
        var context = mssgeModel.GetOtherTypesCreationMsg(options, 'email');
        mailer.SendMail(options.email, options.header, context);
    }

    function SendTokenMsg(options) {
        var context = mssgeModel.GetTokenMsg(options, 'email');
        console.log('email:', options.email);
        mailer.SendMail(options.email, 'OTP', context);
    }

    function SendResetPasswordEmailMsg(options) {
        var context = mssgeModel.GetResetPasswordEmailMsg(options, 'email');
        mailer.SendMail(options.email, 'Reset Password', context);
    }

    function SendHighPriorityEmailMsg(options) {
        var context = mssgeModel.GetHighPriorityEmail(options, 'email');
        mailer.SendMail(options.email, 'High-Priority Integration Error', context);
    }

    return {
        SendIndividualCreationMsg: SendIndividualCreationMsg,
        SendOthersCreationMsg: SendOthersCreationMsg,
        SendTokenMsg: SendTokenMsg,
        SendResetPasswordEmailMsg: SendResetPasswordEmailMsg,
        SendHighPriorityEmailMsg: SendHighPriorityEmailMsg
    }

});