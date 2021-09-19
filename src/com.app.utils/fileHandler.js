var define = require('node-requirejs-define'),
    fs = require('fs'),
    appcfg = require('../com.app.configuration/appConf.json'),
    logger = require('../com.app.utils/logHandler').Logger

define(function() {

    function GetFileBase64(file) {
        return new Promise(function(fulfilled, rejected) {
            var filePath = __dirname + file;
            console.log('filePath', filePath);
            // wait 3000 milliseconds before calling fulfilled() method
            setTimeout(
                function() {
                    fs.readFile(filePath, (err, content) => {
                        if (err) {
                            logger.error('GetFileBase64', err);
                        } else {
                            let base64String = content.toString('base64');
                            fulfilled(base64String);
                        }
                    });
                },
                3000
            )
        })
    }

    function WriteFile(file, name) {
        return new Promise(function(fulfilled, rejected) {

            var fileLocation = appcfg.file.general.path.save + name + appcfg.file.general.extension,
                buff = Buffer.from(file, 'base64'),
                fileWrite = __dirname + fileLocation;
            // wait 3000 milliseconds before calling fulfilled() method
            setTimeout(
                function() {
                    fs.writeFile(fileWrite, buff, function(err) {
                        if (err) {
                            logger.error('WriteFile', err);
                            rejected(err);
                        } else {
                            fulfilled(fileLocation);
                        }
                    });
                },
                3000
            )
        })
    }

    return {
        GetFileBase64: GetFileBase64,
        WriteFile: WriteFile
    }
});