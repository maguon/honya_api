/**
 * Created by zwl on 2018/7/2.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanIntoDAO.js');

function addLoanInto(params,callback){
    var query = " insert into loan_into_info (loan_into_company_id,loan_into_money,not_repayment_money,remark) values ( ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanIntoCompanyId;
    paramsArray[i++]=params.loanIntoMoney;
    paramsArray[i++]=params.notRepaymentMoney;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanInto ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanInto : addLoanInto
}