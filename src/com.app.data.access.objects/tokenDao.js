class TokenDAO {

    constructor(profileId, token, channel, jsnDta) {
        this.profileId = profileId;
        this.token = token;
        this.channel = channel;
        this.jsonData = jsnDta;
    }

    GetCreateTokenSQL() {
        let params = (`'${this.profileId}','${this.token}',
        '${this.channel}','${this.jsonData}'`);
        let sql = `CALL fn_smm_tkn_create(${params})`
        return sql;
    }

    static GetValidateTokenSQL(obj) {
        let params = (`'${obj.profileId}','${obj.token}',
        '${obj.status}','${obj.jsonData}'`);
        let sql = `CALL fn_smm_tkn_validate(${params})`
        return sql;
    }
}

module.exports = TokenDAO;