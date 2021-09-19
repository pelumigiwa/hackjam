class TransactionDAO {

    constructor(profileId, session, transactionReference, transactionDescription, transactionFee, transactionAmount, transactionJson, channel, jsonData) {
        this.profileId = profileId;
        this.session = session;
        this.transactionRef = transactionReference;
        this.transactionDes = transactionDescription;
        this.transactionFee = transactionFee;
        this.transactionAmt = transactionAmount;
        this.transJson = transactionJson;
        this.channel = channel;
        this.jsonData = jsonData;
    }

    CreateTransactionSQL() {
        let params = (`'${this.profileId}','${this.session}','${this.transactionRef}',
        '${this.transactionDes}','${this.transactionFee}','${this.transactionAmt}',
        '${this.transJson}','${this.channel}','${this.jsonData}'`);
        let sql = `CALL fn_transaction_create(${params})`
        return sql;
    }

    static GetTransactionSQL(obj) {
        let params = (`'${obj.profileId}','${obj.session}',
        '${obj.channel}','${obj.jsonData}'`);
        let sql = `CALL fn_transaction_get(${params})`
        return sql;
    }

    static GetReferenceNoSQL(obj) {
        let params = (`'${obj.profileId}','${obj.session}',
        '${obj.channel}','${obj.jsonData}'`);
        let sql = `CALL fn_generate_transaction_ref(${params})`
        return sql;
    }
}

module.exports = TransactionDAO;