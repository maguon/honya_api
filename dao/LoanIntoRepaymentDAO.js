/**
 * Created by zwl on 2018/7/3.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanIntoRepaymentDAO.js');

function addLoanIntoRepayment(params,callback){
    var query = " insert into loan_into_repayment (loan_into_id,repayment_money,rate,day_count,interest_money,fee,repayment_total_money,remark) values ( ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanIntoId;
    paramsArray[i++]=params.repaymentMoney;
    paramsArray[i++]=params.rate;
    paramsArray[i++]=params.dayCount;
    paramsArray[i++]=params.interestMoney;
    paramsArray[i++]=params.fee;
    paramsArray[i++]=params.repaymentTotalMoney;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanIntoRepayment ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanIntoRepayment : addLoanIntoRepayment
}