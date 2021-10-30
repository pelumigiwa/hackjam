class UserDAO {
  constructor(username, password, session, channel, jsonData) {
    this.username = username;
    this.password = password;
    this.session = session;
    this.channel = channel;
    this.jsonData = jsonData;
  }

  CheckUserSQL() {
    let params = `'${this.username}','${this.password}','${this.session}',
        '${this.channel}','${this.jsonData}'`;
    let sql = `CALL fn_profile_login(${params})`;
    return sql;
  }

  static GetUserbyIDSQL(obj) {
    console.log("Session: " + obj.session);
    console.log("UserId: " + obj.userId);
    let params = `'${obj.session}','${obj.userId}'`;
    let sql = `CALL sp_profile_details_get(${params})`;
    return sql;
  }

  static GetUserbyStudentNumberSQL(obj) {
    console.log("Session: " + obj.session);
    console.log("StudentNumber: " + obj.studentNumber);
    let params = `'${obj.session}','${obj.studentNumber}'`;
    let sql = `CALL sp_profile_details_by_student_number_get(${params})`;
    return sql;
  }

  static UpdateUserByIdSQL(obj) {
    let params = `'${obj.profileId}','${obj.session}','${obj.firstName}',
        '${obj.lastName}','${obj.email}','${obj.phone}',
        '${obj.channel}','${obj.jsonData}'`;
    let sql = `CALL fn_profile_details_update(${params})`;
    return sql;
  }

  static UpdateUser2FaSQL(obj) {
    let params = `'${obj.profileId}','${obj.session}',
        '${obj.status}','${obj.channel}','${obj.jsonData}'`;
    let sql = `CALL fn_profile_tfa_update(${params})`;
    return sql;
  }
}

module.exports = UserDAO;
