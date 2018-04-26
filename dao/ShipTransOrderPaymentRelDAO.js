/**
 * Created by zwl on 2018/4/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrderPaymentRelDAO.js');

function addShipTransOrderPaymentRel(params,callback){
    var query = " insert into ship_trans_order_payment_rel (ship_trans_order_id,order_payment_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransOrderId;
    paramsArray[i]=params.orderPaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipTransOrderPaymentRel ');
        return callback(error,rows);
    });
}

function getShipTransOrderPaymentRel(params,callback) {
    var query = " select stopr.*,c.vin,c.make_name,c.model_name, " +
        " st.start_port_name,st.end_port_name,st.start_ship_date,st.end_ship_date,sto.ship_trans_fee " +
        " from ship_trans_order_payment_rel stopr " +
        " left join ship_trans_order sto on stopr.ship_trans_order_id = sto.id " +
        " left join car_info c on sto.car_id = c.id " +
        " left join ship_trans_info st on sto.ship_trans_id = st.id " +
        " where stopr.id is not null ";
    var paramsArray=[],i=0;
    if(params.orderPaymentId){
        paramsArray[i++] = params.orderPaymentId;
        query = query + " and stopr.order_payment_id = ? ";
    }
    query = query + ' group by stopr.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getShipTransOrderPaymentRel ');
        return callback(error,rows);
    });
}

function deleteShipTransOrderPaymentRel(params,callback){
    var query = " delete from ship_trans_order_payment_rel where ship_trans_order_id = ? and order_payment_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransOrderId;
    paramsArray[i]=params.orderPaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteShipTransOrderPaymentRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addShipTransOrderPaymentRel : addShipTransOrderPaymentRel,
    getShipTransOrderPaymentRel : getShipTransOrderPaymentRel,
    deleteShipTransOrderPaymentRel : deleteShipTransOrderPaymentRel
}