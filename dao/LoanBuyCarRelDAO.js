/**
 * Created by zwl on 2018/5/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanBuyCarRelDAO.js');

function addLoanBuyCarRel(params,callback){
    var query = " insert into loan_buy_car_rel (loan_id,car_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanBuyCarRel ');
        return callback(error,rows);
    });
}

function getLoanBuyCarRel(params,callback) {
    var query = " select lbc.*,c.vin,c.make_name,c.model_name,c.pro_date,c.valuation,ct.credit_number " +
        " from loan_buy_car_rel lbc " +
        " left join car_info c on lbc.car_id = c.id " +
        " left join credit_car_rel ccr on c.id = ccr.car_id " +
        " left join credit_info ct on ccr.credit_id = ct.id " +
        " where lbc.id is not null ";
    var paramsArray=[],i=0;
    if(params.loanId){
        paramsArray[i++] = params.loanId;
        query = query + " and lbc.loan_id = ? ";
    }
    if(params.repaymentId){
        paramsArray[i++] = params.repaymentId;
        query = query + " and lbc.repayment_id = ? ";
    }
    query = query + ' group by lbc.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanBuyCarRel ');
        return callback(error,rows);
    });
}

function updateLoanBuyCarRel(params,callback){
    var query = " update loan_buy_car_rel set repayment_id = ? where loan_id = ? and car_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i++]=params.loanId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLoanBuyCarRel ');
        return callback(error,rows);
    });
}

function deleteLoanBuyCarRel(params,callback){
    var query = " delete from loan_buy_car_rel where loan_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteLoanBuyCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanBuyCarRel : addLoanBuyCarRel,
    getLoanBuyCarRel : getLoanBuyCarRel,
    updateLoanBuyCarRel : updateLoanBuyCarRel,
    deleteLoanBuyCarRel : deleteLoanBuyCarRel
}
