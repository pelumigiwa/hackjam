class RegistrationDAO {

    constructor(firstName, lastName, emailAddress, phoneNumber, password, channel, jsonData) {
        this.user_id = 0;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = emailAddress;
        this.phone = phoneNumber;
        this.password = password;
        this.channel = channel;
        this.jsonData = jsonData;
    }

    RegisterUserSQL() {
        let params = (`'${this.email}','${this.password}','${this.firstName}',
        '${this.lastName}','${this.phone}','${this.channel}','${this.jsonData}'`);
        let sql = `CALL fn_profile_details_create(${params})`
        console.log(sql);
        return sql;
    }

    static GetVerifyEmailSQL(obj) {
        let params = (`'${obj.token}','${obj.channel}','${obj.jsonData}'`);
        let sql = `CALL fn_smm_email_validate(${params})`
        return sql;
    }
}

module.exports = RegistrationDAO;