class MaintenanceDAO {

    constructor(profileId, session, oldPassword, newPassword, channel, jsonData) {
        this.profileId = profileId;
        this.session = session;
        this.oldPass = oldPassword;
        this.newPass = newPassword;
        this.channel = channel;
        this.jsonData = jsonData;
    }

    GetChangePasswordSQL() {
        let params = (`'${this.profileId}','${this.session}','${this.oldPass}',
        '${this.newPass}','${this.channel}','${this.jsonData}'`);
        let sql = `CALL fn_profile_passwd_change(${params})`
        console.log('sql script: \n', sql)
        return sql;
    }

    static GetForgotPasswordSQL(obj) {
        let params = (`'${obj.loginName}','${obj.channel}','${obj.jsonData}'`);
        let sql = `CALL fn_profile_passwd_forgot(${params})`
        return sql;
    }

    static GetResetPasswordSQL(obj) {
        let params = (`'${obj.email}','${obj.newPass}',
        '${obj.channel}','${obj.jsonData}'`);
        let sql = `CALL fn_profile_passwd_reset(${params})`
        return sql;
    }
}

module.exports = MaintenanceDAO;