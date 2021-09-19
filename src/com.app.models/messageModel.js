var define = require('node-requirejs-define'),
    appcfg = require('../com.app.configuration/appconf.json'),
    swagger = require('../../swagger.json')

define(function() {
    const url = swagger.host + '/';

    function GetIndividualCreationMsg(options, type) {
        var email = {
            welcomeText: 'Hey ' + options.name,
            subject: 'Verify Email Address for ' + appcfg.application.name,
            messagebody1: 'Thanks for registering for an account on ' + appcfg.application.name + '!',
            messagebody2: 'Before we get started, we just need to confirm that this is you.',
            messagebody3: 'Click below to verify your email address.',
            messagebody4: url + appcfg.application.verification.url + '/' + options.link,
            messagebody5: 'Thanks.'
        };
        console.log('email body:\n', email);
        var sms = {}
        return ((type === 'sms') ? sms : email);
    }

    function GetOtherTypesCreationMsg(options, type) {
        var email = {
            welcomeText: 'Hey ' + options.name,
            subject: 'New Profile Creation',
            messagebody1: 'We wish to inform you that a new user profile has been created for you.',
            messagebody2: 'Your user name is',
            messagebody3: options.email,
            messagebody4: 'Your login password is',
            messagebody5: options.password,
            messagebody6: 'A one time password (OTP) will be sent to you  at first log in.',
            messagebody7: 'Thanks.'
        };
        console.log('email body:\n', email);
        var sms = {}
        return ((type === 'sms') ? sms : email);
    }

    function GetTokenMsg(options, type) {
        var email = {
            welcomeText: 'Hey ' + options.name,
            subject: 'Your one time password (OTP) for ' + appcfg.application.name,
            messagebody1: options.token,
            messagebody3: 'Thanks.'
        };
        console.log('email body:\n', email);
        var sms = {}
        return ((type === 'sms') ? sms : email);
    }

    function GetResetPasswordEmailMsg(options, type) {
        var email = {
            welcomeText: 'Hey ' + options.name,
            subject: 'Your reset password link',
            messagebody1: 'Forgot password?',
            messagebody2: 'That is okay, it happens!.',
            messagebody3: 'Click below to reset your password.',
            messagebody4: url + appcfg.application.passwordReset.url + '/' + options.resetLink,
            messagebody5: 'Thanks.'
        };
        var sms = {

        }
        return ((type === 'sms') ? sms : email);
    }

    function GetHighPriorityEmailMsg(options, type) {
        var email = {
            welcomeText: 'The Following Requires High-Priority Attention',
            subject: 'High-Priority Error',
            messagebody1: 'Status : ' + options.status,
            messagebody2: 'Description : ' + options.respDesc,
            messagebody4: 'Thanks.'
        };
        console.log('email body:\n', email);
        var sms = {}
        return ((type === 'sms') ? sms : email);
    }

    return {
        GetIndividualCreationMsg: GetIndividualCreationMsg,
        GetOtherTypesCreationMsg: GetOtherTypesCreationMsg,
        GetTokenMsg: GetTokenMsg,
        GetResetPasswordEmailMsg: GetResetPasswordEmailMsg,
        GetHighPriorityEmailMsg: GetHighPriorityEmailMsg
    }

});