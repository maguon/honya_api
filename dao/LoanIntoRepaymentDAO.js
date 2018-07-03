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

function getLoanIntoRepayment(params,callback) {
    var query = " select lir.*,lic.company_name " +
        " from loan_into_repayment lir " +
        " left join loan_into_info li on lir.loan_into_id = li.id " +
        " left join loan_into_company_info lic on li.loan_into_company_id = lic.id " +
        " where lir.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and lir.id = ? ";
    }
    if(params.loanIntoCompanyId){
        paramsArray[i++] = params.loanIntoCompanyId;
        query = query + " and li.loan_into_company_id = ? ";
    }
    if(params.loanIntoId){
        paramsArray[i++] = params.loanIntoId;
        query = query + " and li.id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and lr.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and lr.created_on <= ? ";
    }
    if(params.repaymentStatus){
        paramsArray[i++] = params.repaymentStatus;
        query = query + " and lir.repayment_status = ? ";
    }
    query = query + " group by lir.id ";
    query = query + " order by lir.id desc ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanIntoRepayment ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanIntoRepayment : addLoanIntoRepayment,
    getLoanIntoRepayment : getLoanIntoRepayment
}