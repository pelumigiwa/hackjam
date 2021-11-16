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
    let params = `'${obj.session}','${obj.userId}'`;
    let sql = `CALL sp_profile_details_by_id_get(${params})`;
    return sql;
  }

  static GetUserbyStudentNumberSQL(obj) {
    let params = `'${obj.session}','${obj.studentNumber}'`;
    let sql = `CALL sp_profile_details_by_student_number_get(${params})`;
    return sql;
  }

  static GetStudentModulesSQL(obj) {
    let params = `'${obj.session}','${obj.userId}'`;
    let sql = `CALL sp_student_modules_get(${params})`;
    return sql;
  }
  static GetStudentDueDatesSQL(obj) {
    let params = `'${obj.session}','${obj.userId}'`;
    let sql = `CALL sp_student_due_dates_get(${params})`;
    return sql;
  }

  static GetYearlyTuitionSQL(obj) {
    let params = `'${obj.session}','${obj.userId}'`;
    let sql = `CALL sp_student_yearly_tuition_get(${params})`;
    return sql;
  }

  static UpdateUserByIDSQL(obj) {
    let params = `'${obj.userId}','${obj.session}','${obj.firstName}',
        '${obj.lastName}','${obj.email}','${obj.phone}'`;
    //,'${obj.jsonData}'
    let sql = `CALL sp_profile_details_update(${params});`;
    return sql;
  }

  static AddUserIDSQL(obj) {
    let params = `'${obj.session}','${obj.firstName}',
        '${obj.lastName}','${obj.email}','${obj.phone}','${obj.password}','${obj.studentNumber}'`;
    //,'${obj.jsonData}'
    let sql = `CALL sp_user_add(${params});`;
    return sql;
  }

  static UpdateStudentInfoSQL(obj) {
    let params = `'${obj.userId}','${obj.session}','${obj.firstName}',
        '${obj.lastName}','${obj.preffName}','${obj.email}','${obj.phone}',
        '${obj.address1}','${obj.address2}','${obj.country}','${obj.postalCode}'`;
    let sql = `CALL sp_student_info_update(${params});`;
    return sql;
  }

  static UpdateSponsorInfoSQL(obj) {
    let params = `'${obj.userId}','${obj.session}','${obj.firstName}',
        '${obj.lastName}','${obj.email}','${obj.phone}',
        '${obj.address1}','${obj.address2}','${obj.country}'`;
    let sql = `CALL sp_sponsor_info_update(${params});`;
    return sql;
  }

  static UpdateAdditionalContactInfoSQL(obj) {
    let params = `'${obj.userId}','${obj.session}','${obj.firstName}',
        '${obj.lastName}','${obj.email}','${obj.phone}','${obj.country}'`;
    let sql = `CALL sp_add_contact_info_update(${params});`;
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
