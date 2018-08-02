/**
 * Created by zwl on 2018/4/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('PaymentShipOrderRelDAO.js');

function addPaymentShipOrderRel(params,callback){
    var query = " insert into payment_ship_order_rel (ship_trans_order_id,payment_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransOrderId;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addPaymentShipOrderRel ');
        return callback(error,rows);
    });
}

function getPaymentShipOrderRel(params,callback) {
    var query = " select psor.*,c.vin,c.make_name,c.model_name, " +
        " st.start_port_name,st.end_port_name,st.start_ship_date,st.end_ship_date," +
        " st.actual_start_date,st.actual_end_date,st.booking,sto.created_on as ship_trans_order_date,sto.total_fee " +
        " from payment_ship_order_rel psor " +
        " left join ship_trans_order sto on psor.ship_trans_order_id = sto.id " +
        " left join car_info c on sto.car_id = c.id " +
        " left join ship_trans_info st on sto.ship_trans_id = st.id " +
        " where psor.id is not null ";
    var paramsArray=[],i=0;
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and psor.payment_id = ? ";
    }
    query = query + ' group by psor.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getPaymentShipOrderRel ');
        return callback(error,rows);
    });
}

function deletePaymentShipOrderRel(params,callback){
    var query = " delete from payment_ship_order_rel where ship_trans_order_id = ? and payment_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransOrderId;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deletePaymentShipOrderRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addPaymentShipOrderRel : addPaymentShipOrderRel,
    getPaymentShipOrderRel : getPaymentShipOrderRel,
    deletePaymentShipOrderRel : deletePaymentShipOrderRel
}