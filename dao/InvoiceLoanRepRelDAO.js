/**
 * Created by zwl on 2018/7/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceLoanRepRelDAO.js');

function addInvoiceLoanRepRel(params,callback){
    var query = " insert into invoice_loan_rep_rel (repayment_id,invoice_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i]=params.invoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addInvoiceLoanRepRel ');
        return callback(error,rows);
    });
}

function getInvoiceLoanRepRel(params,callback) {
    var query = " select ilrr.*,l.loan_money,l.loan_start_date,lr.created_on as repayment_date, " +
        " lr.create_interest_money,lr.rate,lr.day_count,lr.interest_money,lr.fee,lr.repayment_money " +
        " from invoice_loan_rep_rel ilrr " +
        " left join loan_repayment lr on ilrr.repayment_id = lr.id " +
        " left join loan_info l on lr.loan_id = l.id " +
        " where ilrr.id is not null ";
    var paramsArray=[],i=0;
    if(params.invoiceId){
        paramsArray[i++] = params.invoiceId;
        query = query + " and ilrr.invoice_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getInvoiceLoanRepRel ');
        return callback(error,rows);
    });
}

function getInvoiceLoanRepRelList(params,callback) {
    var query = " select ilrr.*,l.loan_money,l.loan_start_date,lr.created_on as repayment_date, " +
        " lr.create_interest_money,lr.rate,lr.day_count,lr.interest_money,lr.fee,lr.repayment_money,c.vin " +
        " from invoice_loan_rep_rel ilrr " +
        " left join loan_repayment lr on ilrr.repayment_id = lr.id " +
        " left join loan_info l on lr.loan_id = l.id " +
        " left join loan_buy_car_rel lbc on l.id = lbc.loan_id and ilrr.repayment_id = lbc.repayment_id " +
        " left join car_info c on lbc.car_id = c.id " +
        " where ilrr.id is not null ";
    var paramsArray=[],i=0;
    if(params.invoiceId){
        paramsArray[i++] = params.invoiceId;
        query = query + " and ilrr.invoice_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getInvoiceLoanRepRelList ');
        return callback(error,rows);
    });
}

function deleteInvoiceLoanRepRel(params,callback){
    var query = " delete from invoice_loan_rep_rel where repayment_id = ? and invoice_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i]=params.invoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteInvoiceLoanRepRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addInvoiceLoanRepRel : addInvoiceLoanRepRel,
    getInvoiceLoanRepRel : getInvoiceLoanRepRel,
    getInvoiceLoanRepRelList : getInvoiceLoanRepRelList,
    deleteInvoiceLoanRepRel : deleteInvoiceLoanRepRel
}
