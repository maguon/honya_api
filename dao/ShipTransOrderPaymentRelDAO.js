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
    deleteShipTransOrderPaymentRel : deleteShipTransOrderPaymentRel
}