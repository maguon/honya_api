/**
 * Created by zwl on 2018/7/2.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanIntoDAO.js');

function addLoanInto(params,callback){
    var query = " insert into loan_into_info (loan_into_company_id,loan_into_money,remark) values ( ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanIntoCompanyId;
    paramsArray[i++]=params.loanIntoMoney;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanInto ');
        return callback(error,rows);
    });
}

function getLoanInto(params,callback) {
    var query = " select li.*,lic.company_name,sum(lir.repayment_total_money) as repayment_total_money " +
        " from loan_into_info li " +
        " left join loan_into_company_info lic on li.loan_into_company_id = lic.id " +
        " left join loan_into_repayment lir on li.id = lir.loan_into_id " +
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
        query = query + " and li.loan_into_status in ("+params.loanIntoStatusArr + ") ";
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

function getLoanIntoNotCount(params,callback) {
    var query = " select sum(distinct lic.base_money) as company_base_money,sum(li.not_repayment_money) as not_repayment_money,count(li.id) as loan_count " +
        " from loan_into_info li " +
        " left join loan_into_company_info lic on li.loan_into_company_id = lic.id " +
        " where li.id is not null ";
    var paramsArray=[],i=0;
    if(params.loanIntoStatusArr){
        query = query + " and li.loan_into_status in ("+params.loanIntoStatusArr + ") "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanIntoNotCount ');
        return callback(error,rows);
    });
}

function updateLoanInto(params,callback){
    var query = " update loan_into_info set loan_into_company_id = ? , loan_into_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanIntoCompanyId;
    paramsArray[i++]=params.loanIntoMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.loanIntoId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanInto ');
        return callback(error,rows);
    });
}

function updateLoanIntoStatus(params,callback){
    if(params.loanIntoStatus==2){
        var query = " update loan_into_info set not_repayment_money = ? , start_date_id = ? , loan_into_start_date = ? , loan_into_status = ? where id = ? " ;
    }else if(params.loanIntoStatus==4){
        var query = " update loan_into_info set end_date_id = ? , loan_into_end_date = ? , loan_into_status = ? where id = ? " ;
    }else{
        var query = " update loan_into_info set loan_into_status = ? where id = ? " ;
    }
    var paramsArray=[],i=0;
    if(params.loanIntoStartDate){
        paramsArray[i++] = params.notRepaymentMoney;
        paramsArray[i++] = params.startDateId;
        paramsArray[i++] = params.loanIntoStartDate;
    }
    if(params.loanIntoEndDate){
        paramsArray[i++] = params.endDateId;
        paramsArray[i++] = params.loanIntoEndDate;
    }
    paramsArray[i++]=params.loanIntoStatus;
    paramsArray[i]=params.loanIntoId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanIntoStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanInto : addLoanInto,
    getLoanInto : getLoanInto,
    getLoanIntoNotCount : getLoanIntoNotCount,
    updateLoanInto : updateLoanInto,
    updateLoanIntoStatus : updateLoanIntoStatus
}