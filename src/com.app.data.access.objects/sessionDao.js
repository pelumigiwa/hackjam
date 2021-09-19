class SessionDAO {

    constructor(profileId, session, channel, jsonData) {
        this.profileId = profileId;
        this.session = session;
        this.channel = channel;
        this.jsonData = jsonData;
    }

    GetSessionSQL() {
        let params = (`'${this.profileId}','${this.session}',
        '${this.channel}','${this.jsonData}'`);
        let sql = `CALL fn_session_create(${params})`
        return sql;
    }
}

module.exports = SessionDAO;