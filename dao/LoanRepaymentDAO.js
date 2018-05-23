/**
 * Created by zwl on 2018/5/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanRepaymentDAO.js');

function addLoanRepayment(params,callback){
    var query = " insert into loan_repayment (loan_id,repayment_money,rate," +
        "create_interest_money,day_count,interest_money,fee,remark) values ( ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanId;
    paramsArray[i++]=params.repaymentMoney;
    paramsArray[i++]=params.rate;
    paramsArray[i++]=params.createInterestMoney;
    paramsArray[i++]=params.dayCount;
    paramsArray[i++]=params.interestMoney;
    paramsArray[i++]=params.fee;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanRepayment ');
        return callback(error,rows);
    });
}

function getLoanRepayment(params,callback) {
    var query = " select lr.* from loan_repayment lr where lr.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and lr.id = ? ";
    }
    if(params.loanId){
        paramsArray[i++] = params.loanId;
        query = query + " and lr.loan_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanRepayment ');
        return callback(error,rows);
    });
}

function updateLoanRepayment(params,callback){
    var query = " update loan_repayment set repayment_money = ? , rate = ? , create_interest_money = ? , " +
        " day_count = ? , interest_money = ? , fee = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentMoney;
    paramsArray[i++]=params.rate;
    paramsArray[i++]=params.createInterestMoney;
    paramsArray[i++]=params.dayCount;
    paramsArray[i++]=params.interestMoney;
    paramsArray[i++]=params.fee;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.repaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanRepayment ');
        return callback(error,rows);
    });
}

function updateLoanRepaymentStatus(params,callback){
    var query = " update loan_repayment set repayment_end_date = ? , repayment_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentEndDate;
    paramsArray[i++]=params.repaymentStatus;
    paramsArray[i]=params.repaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanRepaymentStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanRepayment : addLoanRepayment,
    getLoanRepayment : getLoanRepayment,
    updateLoanRepayment : updateLoanRepayment,
    updateLoanRepaymentStatus : updateLoanRepaymentStatus
}
