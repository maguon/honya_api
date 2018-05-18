/**
 * Created by zwl on 2018/5/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialLoanMortgageCarRelDAO.js');

function addFinancialLoanMortgageCarRel(params,callback){
    var query = " insert into financial_loan_mortgage_car_rel (financial_loan_id,car_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.financialLoanId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addFinancialLoanMortgageCarRel ');
        return callback(error,rows);
    });
}

function deleteFinancialLoanMortgageCarRel(params,callback){
    var query = " delete from financial_loan_mortgage_car_rel where financial_loan_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.financialLoanId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteFinancialLoanMortgageCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addFinancialLoanMortgageCarRel : addFinancialLoanMortgageCarRel,
    deleteFinancialLoanMortgageCarRel : deleteFinancialLoanMortgageCarRel
}