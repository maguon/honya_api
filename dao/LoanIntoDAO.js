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

function getLoanInto(params,callback) {
    var query = " select li.*,lic.company_name " +
        " from loan_into_info li " +
        " left join loan_into_company_info lic on li.loan_into_company_id = lic.id " +
        " where li.id is not null ";
    var paramsArray=[],i=0;
    if(params.loanIntoId){
        paramsArray[i++] = params.loanIntoId;
        query = query + " and li.id = ? ";
    }
    if(params.loanIntoCompanyId){
        paramsArray[i++] = params.loanIntoCompanyId;
        query = query + " and li.loan_into_company_id = ? ";
    }
    if(params.companyName){
        paramsArray[i++] = params.companyName;
        query = query + " and lic.company_name = ? ";
    }
    if(params.loanIntoStatus){
        paramsArray[i++] = params.loanIntoStatus;
        query = query + " and li.loan_into_status = ? ";
    }
    if(params.loanIntoStatusArr){
        query = query + " and li.loan_into_status in ("+params.loanIntoStatusArr + ") "
    }
    if(params.loanIntoStartDateStart){
        paramsArray[i++] = params.loanIntoStartDateStart +" 00:00:00";
        query = query + " and li.loan_into_start_date >= ? ";
    }
    if(params.loanIntoStartDateEnd){
        paramsArray[i++] = params.loanIntoStartDateEnd +" 23:59:59";
        query = query + " and li.loan_into_start_date <= ? ";
    }
    if(params.loanIntoEndDateStart){
        paramsArray[i++] = params.loanIntoEndDateStart +" 00:00:00";
        query = query + " and li.loan_into_end_date >= ? ";
    }
    if(params.loanIntoEndDateEnd){
        paramsArray[i++] = params.loanIntoEndDateEnd +" 23:59:59";
        query = query + " and li.loan_into_end_date <= ? ";
    }
    query = query + " group by li.id ";
    query = query + " order by li.id desc ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanInto ');
        return callback(error,rows);
    });
}

function updateLoanInto(params,callback){
    var query = " update loan_into_info set loan_into_company_id = ? , loan_into_money = ? , not_repayment_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanIntoCompanyId;
    paramsArray[i++]=params.loanIntoMoney;
    paramsArray[i++]=params.notRepaymentMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.loanIntoId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanInto ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanInto : addLoanInto,
    getLoanInto : getLoanInto,
    updateLoanInto : updateLoanInto
}