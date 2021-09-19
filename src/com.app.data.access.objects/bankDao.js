class BankDAO {

    constructor(profileId, session, bankName, accountNumber, accountName, channel, jsonData) {
        this.profileId = profileId;
        this.session = session;
        this.bnkName = bankName;
        this.accNumber = accountNumber;
        this.accName = accountName;
        this.channel = channel;
        this.jsonData = jsonData;
    }

    RegisterBankSQL() {
        let params = (`'${this.profileId}','${this.session}',
        '${this.bnkName}','${this.accNumber}','${this.accName}',
        '${this.channel}','${this.jsonData}'`);
        let sql = `CALL fn_bank_details_create(${params})`
        return sql;
    }

    static GetBankSQL(obj) {
        let params = (`'${obj.profileId}','${obj.session}',
        '${obj.channel}','${obj.jsonData}'`);
        let sql = `CALL fn_bank_details_get(${params})`
        return sql;
    }

    static UpdateBankByIdSQL(obj) {
        let params = (`'${obj.profileId}','${obj.session}','${obj.bankId}',
        '${obj.bnkName}','${obj.accNumber}','${obj.accName}',
        '${obj.channel}','${obj.jsonData}'`);
        let sql = `CALL fn_bank_details_update(${params})`
        return sql;
    }
}

module.exports = BankDAO;