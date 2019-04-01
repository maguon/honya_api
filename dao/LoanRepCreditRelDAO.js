/**
 * Created by zwl on 2018/5/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanRepCreditRelDAO.js');

function addLoanRepCreditRel(params,callback){
    var query = " insert into loan_rep_credit_rel (repayment_id,credit_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i++]=params.creditId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanRepCreditRel ');
        return callback(error,rows);
    });
}

function getLoanRepCreditRel(params,callback) {
    var query = " select lrcr.*,c.credit_number,c.credit_money,c.receive_card_money," +
        " c.actual_money,difference_fee,c.created_on as credit_created_date " +
        " from loan_rep_credit_rel lrcr " +
        " left join credit_info c on lrcr.credit_id = c.id " +
        " where lrcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and lrcr.repayment_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanRepCreditRel ');
        return callback(error,rows);
    });
}

function deleteLoanRepCreditRel(params,callback){
    var query = " delete from loan_rep_credit_rel where repayment_id = ? and credit_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i]=params.creditId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteLoanRepCreditRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanRepCreditRel : addLoanRepCreditRel,
    getLoanRepCreditRel : getLoanRepCreditRel,
    deleteLoanRepCreditRel : deleteLoanRepCreditRel
}
