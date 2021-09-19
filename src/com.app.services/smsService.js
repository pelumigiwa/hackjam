var define = require('node-requirejs-define'),
    mailer = require('../com.app.utils/mailHandler'),
    sms = require('../com.app.utils/smsHandler'),
    mssgeModel = require('../com.app.models/messageModel'),
    dao = require('../com.app.data.access.objects/dbconnect');

define(function() {

    function Main() {
        loadMessages(function(messages) {
            for (var i = 0; i < messages.length; ++i) {
                var message = messages[i];
                var messageID = message.msg_id;
                sendMessage(message, function(returnMessage, messageID) {
                    console.log('sent successfully ' + returnMessage);
                    console.log('message id is ...', messageID)
                    updateSentMessages(messageID);
                }, function(error, messageID) {
                    console.log('error sending SMS : ' + error + ' for message with ID : ' + messageID);
                }, messageID);
            }
        }, function(error) {
            console.log(error);
        });
    }

    const sendMessage = function(options, succ, failure, messageId) {
        console.log('message send option is ** ' + options);
        if (options.msg_channel === 'SMS') {
            var sms = mssgeModel.getNewMessageTemplate(options, 'sms'),
                phone = options.msg_phoneno.toString();
            if (phone[0] !== '+') {
                phone = "+27" + phone.substr(1, +phone.length);
            }
            sms.sendNewSMS(phone, sms.message, succ, failure, messageId);
            // sms.sendDummySMS(phone,sms.message,succ,failure);
        } else {
            var email = mssgeModel.getNewMessageTemplate(options, 'email');
            mailer.SendNewMail(options.msg_email, options.msg_subject, email, succ, failure, true, messageId);
        }
    }

    const loadMessages = function(succ, failure) {
        var paramArray = [
            'System Crone Job',
            'N/A'
        ];
        dao.CallDBFunction('GET_MESSAGE_LIST', paramArray, function(data) {
            if ((data.status === 'OK')) {
                succ(data.messageData);
            } else {
                failure(data.message);
            }
        });
    }

    const updateSentMessages = function(ids) {
        var paramArray = [
            'System Crone Job',
            'N/A',
            ids
        ];
        dao.Query('SYS_UPDATE_SENT_MESSAGE', paramArray, function(data) {
            if ((data.status === 'OK')) {
                console.log('message sending batch completed for ids : ' + ids);
            } else {
                console.log('message sending batch failed for ids : ' + ids);
            }
        });
    }

    return {
        Main: Main
    }
});