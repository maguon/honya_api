/**
 * Created by zwl on 2018/5/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialCreditCarRelDAO.js');

function addFinancialCreditCarRel(params,callback){
    var query = " insert into financial_credit_car_rel (financial_credit_id,car_id) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.financialCreditId;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addFinancialCreditCarRel ');
        return callback(error,rows);
    });
}

function getFinancialCreditCarRel(params,callback) {
    var query = " select fccr.*,c.vin,c.make_name,c.model_name,c.colour,c.valuation,c.remark, " +
        " st.start_port_name,st.end_port_name,st.start_ship_date,st.end_ship_date,st.actual_start_date,st.actual_end_date, " +
        " sc.ship_company_name,st.ship_name,st.container,st.booking,st.tab " +
        " from financial_credit_car_rel fccr " +
        " left join car_info c on fccr.car_id = c.id " +
        " left join ship_trans_car_rel stcr on c.id = stcr.car_id " +
        " left join ship_trans_info st on stcr.ship_trans_id = st.id " +
        " left join ship_company_info sc on st.ship_company_id = sc.id " +
        " where fccr.id is not null ";
    var paramsArray=[],i=0;
    if(params.financialCreditId){
        paramsArray[i++] = params.financialCreditId;
        query = query + " and fccr.financial_credit_id = ? ";
    }
    query = query + ' group by fccr.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getFinancialCreditCarRel ');
        return callback(error,rows);
    });
}

function deleteFinancialCreditCarRel(params,callback){
    var query = " delete from financial_credit_car_rel where financial_credit_id = ? and car_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.financialCreditId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteFinancialCreditCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addFinancialCreditCarRel : addFinancialCreditCarRel,
    getFinancialCreditCarRel : getFinancialCreditCarRel,
    deleteFinancialCreditCarRel : deleteFinancialCreditCarRel
}