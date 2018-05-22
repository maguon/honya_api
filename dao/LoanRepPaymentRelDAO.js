/**
 * Created by zwl on 2018/5/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanRepPaymentRelDAO.js');

function addLoanRepPaymentRel(params,callback){
    var query = " insert into loan_rep_payment_rel (repayment_id,payment_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i++]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanRepPaymentRel ');
        return callback(error,rows);
    });
}

function getLoanRepPaymentRel(params,callback) {
    var query = " select lrpr.*,op.payment_type,op.number,op.payment_money,op.created_on as created_payment_date " +
        " from loan_rep_payment_rel lrpr " +
        " left join order_payment op on lrpr.payment_id = op.id " +
        " where lrpr.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and lrpr.repayment_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanRepPaymentRel ');
        return callback(error,rows);
    });
}

function updateRepPaymentMoney(params,callback){
    var query = " update loan_rep_payment_rel set this_payment_money = ? where repayment_id = ? and payment_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.thisPaymentMoney;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateRepPaymentMoney ');
        return callback(error,rows);
    });
}

function deleteLoanRepPaymentRel(params,callback){
    var query = " delete from loan_rep_payment_rel where repayment_id = ? and payment_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteLoanRepPaymentRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanRepPaymentRel : addLoanRepPaymentRel,
    getLoanRepPaymentRel : getLoanRepPaymentRel,
    updateRepPaymentMoney : updateRepPaymentMoney,
    deleteLoanRepPaymentRel : deleteLoanRepPaymentRel
}
