/**
 * Created by zwl on 2018/5/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('PaymentLoanRepRelDAO.js');

function addPaymentLoanRepRel(params,callback){
    var query = " insert into payment_loan_rep_rel (repayment_id,payment_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i++]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addPaymentLoanRepRel ');
        return callback(error,rows);
    });
}

function getPaymentLoanRepRel(params,callback) {
    var query = " select plrr.*,l.id as loan_id,l.loan_money,lr.repayment_money,lr.interest_money,lr.fee,lr.created_on as repayment_date " +
        ",p.payment_type,p.number,p.payment_money,p.created_on as created_payment_date  " +
        " from payment_loan_rep_rel plrr " +
        " left join payment_info p on plrr.payment_id = p.id " +
        " left join loan_repayment lr on plrr.repayment_id = lr.id " +
        " left join loan_info l on lr.loan_id = l.id " +
        " where plrr.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and plrr.repayment_id = ? ";
    }
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and plrr.payment_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getPaymentLoanRepRel ');
        return callback(error,rows);
    });
}

function getPaymentRepMoney(params,callback) {
    var query = " select sum(plrr.this_payment_money) as payment_rep_money from payment_loan_rep_rel plrr " +
        " where plrr.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and plrr.repayment_id= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getPaymentRepMoney ');
        return callback(error,rows);
    });
}

function updatePaymentRepMoney(params,callback){
    var query = " update payment_loan_rep_rel set this_payment_money = ? where repayment_id = ? and payment_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.thisPaymentMoney;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updatePaymentRepMoney ');
        return callback(error,rows);
    });
}

function deletePaymentLoanRepRel(params,callback){
    var query = " delete from payment_loan_rep_rel where repayment_id = ? and payment_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deletePaymentLoanRepRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addPaymentLoanRepRel : addPaymentLoanRepRel,
    getPaymentLoanRepRel : getPaymentLoanRepRel,
    getPaymentRepMoney : getPaymentRepMoney,
    updatePaymentRepMoney : updatePaymentRepMoney,
    deletePaymentLoanRepRel : deletePaymentLoanRepRel
}
