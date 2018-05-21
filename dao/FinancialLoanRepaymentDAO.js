/**
 * Created by zwl on 2018/5/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialLoanRepaymentDAO.js');

function addFinancialLoanRepayment(params,callback){
    var query = " insert into financial_loan_repayment (financial_loan_id,repayment_money,rate," +
        "create_interest_money,create_interest_day,interest_money,fee,remark) values ( ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.financialLoanId;
    paramsArray[i++]=params.repaymentMoney;
    paramsArray[i++]=params.rate;
    paramsArray[i++]=params.createInterestMoney;
    paramsArray[i++]=params.createInterestDay;
    paramsArray[i++]=params.interestMoney;
    paramsArray[i++]=params.fee;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addFinancialLoanRepayment ');
        return callback(error,rows);
    });
}


module.exports ={
    addFinancialLoanRepayment : addFinancialLoanRepayment
}
