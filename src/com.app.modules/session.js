var define = require('node-requirejs-define'),
    jswt = require('../com.app.utils/jwtHandler'),
    appcfg = require('../com.app.configuration/appConf.json'),
    sesionDao = require('../com.app.data.access.objects/sessionDao'),
    dispatch = require('../com.app.service.layer/dispatcher'),
    bseDao = require('../com.app.data.access.objects/baseDao'),
    logger = require('../com.app.utils/logHandler').Logger;

define(function() {

    function SessionMgt(obj, res, next) {
        try {
            var profileId = obj.profileId,
                token = obj.token,
                session = jswt.GetSession(profileId, token),
                channel = obj.channel,
                jsnReq = { profileId: profileId, session: session, channel: channel },
                jsnDta = JSON.stringify(jsnReq);

            logger.info('SessionMgt()', jsnDta);

            let sesion = new sesionDao(profileId, session, channel, jsnDta);
            bseDao.Query(sesion.GetSessionSQL(sesion), (err, resp) => {
                if (err) {
                    dispatch.SendDataBaseErrorMessage(res, err);
                } else {
                    var data = JSON.parse(resp);
                    dispatch.SendGenricMessage(res, data);
                    logger.info('SessionMgt()', JSON.stringify(data));
                }
            });
        } catch (e) {
            logger.error('SessionMgt()', e);
            dispatch.DispatchErrorMessage(res, 'application error in SessionMgt()..');
        }
    }

    return {
        SessionMgt: SessionMgt
    }
});