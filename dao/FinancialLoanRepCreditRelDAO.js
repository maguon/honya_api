/**
 * Created by zwl on 2018/5/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialLoanRepCreditRelDAO.js');

function addFinancialLoanRepCreditRel(params,callback){
    var query = " insert into financial_loan_rep_credit_rel (repayment_id,credit_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i++]=params.creditId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addFinancialLoanRepCreditRel ');
        return callback(error,rows);
    });
}

function getFinancialLoanRepCreditRel(params,callback) {
    var query = " select flrcr.*,fc.credit_money,fc.actual_money,fc.created_on as credit_created_date from financial_loan_rep_credit_rel flrcr " +
        " left join financial_credit_info fc on flrcr.credit_id = fc.id " +
        " where flrcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and flrcr.repayment_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getFinancialLoanRepCreditRel ');
        return callback(error,rows);
    });
}

function deleteFinancialLoanRepCreditRel(params,callback){
    var query = " delete from financial_loan_rep_credit_rel where repayment_id = ? and credit_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i]=params.creditId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteFinancialLoanRepCreditRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addFinancialLoanRepCreditRel : addFinancialLoanRepCreditRel,
    getFinancialLoanRepCreditRel : getFinancialLoanRepCreditRel,
    deleteFinancialLoanRepCreditRel : deleteFinancialLoanRepCreditRel
}
