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

function getLoanIntoBuyCarRel(params,callback) {
    var query = " select libcr.*,c.vin,c.make_name,c.model_name,c.pro_date,c.valuation,ct.credit_number,c.entrust_id,e.short_name " +
        " from loan_into_buy_car_rel libcr " +
        " left join car_info c on libcr.car_id = c.id " +
        " left join credit_car_rel ccr on c.id = ccr.car_id " +
        " left join credit_info ct on ccr.credit_id = ct.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " where libcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.loanIntoId){
        paramsArray[i++] = params.loanIntoId;
        query = query + " and libcr.loan_into_id = ? ";
    }
    query = query + ' group by libcr.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLoanIntoBuyCarRel ');
        return callback(error,rows);
    });
}

function deleteLoanIntoBuyCarRel(params,callback){
    var query = " delete from loan_into_buy_car_rel where loan_into_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanIntoId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteLoanIntoBuyCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addLoanIntoBuyCarRel : addLoanIntoBuyCarRel,
    getLoanIntoBuyCarRel : getLoanIntoBuyCarRel,
    deleteLoanIntoBuyCarRel : deleteLoanIntoBuyCarRel
}
