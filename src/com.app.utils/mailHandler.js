var define = require('node-requirejs-define'),
    fs = require('fs'),
    pug = require('pug'),
    sgMail = require('@sendgrid/mail'),
    appcfg = require('../com.app.configuration/appConf.json'),
    logger = require('../com.app.utils/logHandler').Logger;

define(function() {


    var fromAddress = appcfg.application.mailSettings.mailProvider2.sendgrid.from;

    sgMail.setApiKey(appcfg.application.mailSettings.mailProvider2.sendgrid.api.key);

    function SendMail(toAddress, subject, context, succ, errorMain, messageID, nameFile, basefile) {

        switch (basefile) {
            case undefined:
            case "":
                logger.info('SendMail', JSON.stringify(context));
                var template;
                switch (subject.toLowerCase()) {
                    case "otp":
                        template = __dirname + appcfg.application.mailSettings.templates.otp.pug;
                        break;
                    default:
                        template = __dirname + appcfg.application.mailSettings.templates.generic.pug;
                        break;
                }
                fs.readFile(template, 'utf8', function(err, file) {
                    if (err) {
                        logger.error('SendMail', err);
                    } else {
                        var compiledTmpl = pug.compile(file, { filename: template }),
                            html = compiledTmpl(context),
                            fName = nameFile;
                        fData = basefile;
                        mailSender(toAddress, subject, html, succ, errorMain, messageID, fName, fData);
                    }
                });
                break;
            default:
                logger.info('SendMailAttachment', JSON.stringify(context));
                var template = __dirname + appcfg.application.mailSettings.templates.generic.pug;

                fs.readFile(template, 'utf8', function(err, file) {
                    if (err) {
                        logger.error('SendMailAttachment', err);
                    } else {
                        var compiledTmpl = pug.compile(file, { filename: template }),
                            html = compiledTmpl(context),
                            fNname = nameFile,
                            fData = basefile;
                        mailSender(toAddress, subject, html, succ, errorMain, messageID, fNname, fData);
                    }
                });
                break;
        }
    };

    const mailSender = function(toAddress, subject, content, succ, errorMain, messageID, fileName, fileData) {
        var mailOptions = '';
        switch (fileName) {
            case undefined:
            case '':
                mailOptions = {
                    from: fromAddress,
                    to: toAddress,
                    subject: subject,
                    html: content
                };
                break;
            default:
                mailOptions = {
                    from: fromAddress,
                    to: toAddress,
                    subject: subject,
                    html: content,
                    attachments: [{
                        filename: fileName,
                        content: fileData,
                        encoding: 'base64',
                        contentType: 'application/pdf'
                    }]
                };
                break;
        }
        sgMail.send(mailOptions, function(error, info) {
            if (error) {
                if (errorMain !== undefined) {
                    logger.error('error sending email :', error);
                }
            } else {
                logger.info('mailSender', 'Email sent');
            }
        });
    };

    return {
        SendMail: SendMail
    }

});