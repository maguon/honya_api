/**
 * Created by zwl on 2018/6/4.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanCompanyDAO.js');

function addLoanCompany(params,callback){
    var query = " insert into loan_company_info (company_name,base_money,contacts,tel,email,remark) values ( ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.companyName;
    paramsArray[i++]=params.baseMoney;
    paramsArray[i++]=params.contacts;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.email;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanCompany ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanCompany : addLoanCompany
}
