/**
 * Created by zwl on 2018/5/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CreditCarRelDAO.js');

function addCreditCarRel(params,callback){
    var query = " insert into credit_car_rel (credit_id,car_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.creditId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCreditCarRel ');
        return callback(error,rows);
    });
}

function getCreditCarRel(params,callback) {
    var query = " select ccr.*,c.vin,c.make_name,c.model_name,c.colour,c.valuation,c.remark, " +
        " st.start_port_name,st.end_port_name,st.start_ship_date,st.end_ship_date,st.actual_start_date,st.actual_end_date, " +
        " sc.ship_company_name,st.ship_name,st.container,st.booking,st.tab " +
        " from credit_car_rel ccr " +
        " left join car_info c on ccr.car_id = c.id " +
        " left join ship_trans_car_rel stcr on c.id = stcr.car_id " +
        " left join ship_trans_info st on stcr.ship_trans_id = st.id " +
        " left join ship_company_info sc on st.ship_company_id = sc.id " +
        " where ccr.id is not null ";
    var paramsArray=[],i=0;
    if(params.creditId){
        paramsArray[i++] = params.creditId;
        query = query + " and ccr.credit_id = ? ";
    }
    query = query + ' group by ccr.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCreditCarRel ');
        return callback(error,rows);
    });
}

function deleteCreditCarRel(params,callback){
    var query = " delete from credit_car_rel where credit_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.creditId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteCreditCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addCreditCarRel : addCreditCarRel,
    getCreditCarRel : getCreditCarRel,
    deleteCreditCarRel : deleteCreditCarRel
}