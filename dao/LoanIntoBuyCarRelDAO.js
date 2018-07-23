/**
 * Created by zwl on 2018/7/23.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanIntoBuyCarRelDAO.js');

function addLoanIntoBuyCarRel(params,callback){
    var query = " insert into loan_into_buy_car_rel (loan_into_id,car_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanIntoId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addLoanIntoBuyCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanIntoBuyCarRel : addLoanIntoBuyCarRel
}
