/**
 * Created by zwl on 2018/5/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanMortgageCarRelDAO.js');

function addLoanMortgageCarRel(params,callback){
    var query = " insert into loan_mortgage_car_rel (loan_id,car_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanMortgageCarRel ');
        return callback(error,rows);
    });
}

function getLoanMortgageCarRel(params,callback) {
    var query = " select lmc.*,c.vin,c.make_name,c.model_name,c.pro_date,c.valuation,csr.enter_time " +
        " from loan_mortgage_car_rel lmc " +
        " left join car_info c on lmc.car_id = c.id " +
        " left join car_storage_rel csr on c.id = csr.car_id " +
        " where csr.rel_status = 1 and lmc.id is not null ";
    var paramsArray=[],i=0;
    if(params.loanId){
        paramsArray[i++] = params.loanId;
        query = query + " and lmc.loan_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanMortgageCarRel ');
        return callback(error,rows);
    });
}

function deleteLoanMortgageCarRel(params,callback){
    var query = " delete from loan_mortgage_car_rel where loan_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteLoanMortgageCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanMortgageCarRel : addLoanMortgageCarRel,
    getLoanMortgageCarRel : getLoanMortgageCarRel,
    deleteLoanMortgageCarRel : deleteLoanMortgageCarRel
}