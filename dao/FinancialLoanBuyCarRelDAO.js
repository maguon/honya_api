/**
 * Created by zwl on 2018/5/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialLoanBuyCarRelDAO.js');

function addFinancialLoanBuyCarRel(params,callback){
    var query = " insert into financial_loan_buy_car_rel (financial_loan_id,car_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.financialLoanId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addFinancialLoanBuyCarRel ');
        return callback(error,rows);
    });
}

function getFinancialLoanBuyCarRel(params,callback) {
    var query = " select flbc.*,c.vin,c.make_name,c.model_name,c.pro_date,c.valuation " +
        " from financial_loan_buy_car_rel flbc " +
        " left join car_info c on flbc.car_id = c.id " +
        " where flbc.id is not null ";
    var paramsArray=[],i=0;
    if(params.financialLoanId){
        paramsArray[i++] = params.financialLoanId;
        query = query + " and flbc.financial_loan_id = ? ";
    }
    query = query + ' group by flbc.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getFinancialLoanBuyCarRel ');
        return callback(error,rows);
    });
}

function deleteFinancialLoanBuyCarRel(params,callback){
    var query = " delete from financial_loan_buy_car_rel where financial_loan_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.financialLoanId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteFinancialLoanBuyCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addFinancialLoanBuyCarRel : addFinancialLoanBuyCarRel,
    getFinancialLoanBuyCarRel : getFinancialLoanBuyCarRel,
    deleteFinancialLoanBuyCarRel : deleteFinancialLoanBuyCarRel
}
