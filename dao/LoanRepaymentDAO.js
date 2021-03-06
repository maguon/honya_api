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
    var query = " select lr.*,e.id as entrust_id,e.entrust_type,e.short_name,l.loan_money,l.loan_start_date " +
        " from loan_repayment lr " +
        " left join loan_info l on lr.loan_id = l.id " +
        " left join entrust_info e on l.entrust_id = e.id " +
        " left join loan_rep_credit_rel lrcr on lr.id = lrcr.repayment_id " +
        " left join payment_loan_rep_rel plrr on lr.id = plrr.repayment_id " +
        " where lr.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and lr.id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and l.entrust_id = ? ";
    }
    if(params.loanId){
        paramsArray[i++] = params.loanId;
        query = query + " and lr.loan_id = ? ";
    }
    if(params.repaymentStatus){
        paramsArray[i++] = params.repaymentStatus;
        query = query + " and lr.repayment_status = ? ";
    }
    if(params.creditId){
        paramsArray[i++] = params.creditId;
        query = query + " and lrcr.credit_id = ? ";
    }
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and plrr.payment_id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and lr.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and lr.created_on <= ? ";
    }
    if(params.invoiceStatus){
        paramsArray[i++] = params.invoiceStatus;
        query = query + " and lr.invoice_status = ? ";
    }
    query = query + " group by lr.id ";
    query = query + " order by lr.id desc ";
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

function updateLoanRepaymentFee(params,callback){
    var query = " update loan_repayment inner join " +
        " (select if(isnull(sum(ccr.lc_handling_fee)),0,sum(ccr.lc_handling_fee)) as lc_handling_fee_total, " +
        " if(isnull(sum(ccr.bank_services_fee)),0,sum(ccr.bank_services_fee)) as bank_services_fee_total " +
        " from credit_car_rel ccr where ccr.id is not null and ccr.repayment_id = "+params.repaymentId+") c " +
        " set loan_repayment.lc_handling_fee_total = c.lc_handling_fee_total, " +
        " loan_repayment.bank_services_fee_total = c.bank_services_fee_total " +
        " where loan_repayment.id = "+params.repaymentId ;
    var paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanRepaymentFee ');
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

function updateLoanRepaymentInvoiceStatus(params,callback){
    var query = " update loan_repayment set invoice_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.invoiceStatus;
    paramsArray[i]=params.repaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanRepaymentInvoiceStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanRepayment : addLoanRepayment,
    getLoanRepayment : getLoanRepayment,
    updateLoanRepayment : updateLoanRepayment,
    updateLoanRepaymentFee : updateLoanRepaymentFee,
    updateLoanRepaymentStatus : updateLoanRepaymentStatus,
    updateLoanRepaymentInvoiceStatus : updateLoanRepaymentInvoiceStatus
}
