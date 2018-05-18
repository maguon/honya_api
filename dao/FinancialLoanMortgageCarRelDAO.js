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

function getFinancialLoanMortgageCarRel(params,callback) {
    var query = " select flmc.*,c.vin,c.make_name,c.model_name,c.pro_date,c.valuation,csr.enter_time " +
        " from financial_loan_mortgage_car_rel flmc " +
        " left join car_info c on flmc.car_id = c.id " +
        " left join car_storage_rel csr on c.id = csr.car_id " +
        " where csr.rel_status = 1 and flmc.id is not null ";
    var paramsArray=[],i=0;
    if(params.financialLoanId){
        paramsArray[i++] = params.financialLoanId;
        query = query + " and flmc.financial_loan_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getFinancialLoanMortgageCarRel ');
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
    getFinancialLoanMortgageCarRel : getFinancialLoanMortgageCarRel,
    deleteFinancialLoanMortgageCarRel : deleteFinancialLoanMortgageCarRel
}