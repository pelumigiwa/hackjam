class AuditDAO {

    constructor(profileId, session, userId, startDate, endDate, channel, jsonData) {
        this.profileId = profileId;
        this.session = session;
        this.userId = userId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.channel = channel;
        this.jsonData = jsonData;
    }

    GetAuditSQL() {
        let params = (`'${this.profileId}','${this.session}',
        '${this.userId}','${this.startDate}','${this.endDate}',
        '${this.channel}','${this.jsonData}'`);
        let sql = `CALL fn_audit_get(${params})`
        return sql;
    }

    static GetUserAuditSQL(obj) {
        let params = (`'${obj.profileId}','${obj.session}',
        '${obj.startDate}','${obj.endDate}',
        '${obj.channel}','${obj.jsonData}'`);
        let sql = `CALL fn_profile_audit_get(${params})`
        return sql;
    }
}

module.exports = AuditDAO;