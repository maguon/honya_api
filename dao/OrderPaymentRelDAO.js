/**
 * Created by zwl on 2018/4/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('OrderPaymentRelDAO.js');

function addOrderPaymentRel(params,callback){
    var query = " insert into order_payment_rel (storage_order_id,order_payment_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageOrderId;
    paramsArray[i]=params.orderPaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addOrderPaymentRel ');
        return callback(error,rows);
    });
}

function getOrderPaymentRel(params,callback) {
    var query = " select opr.*,c.vin,c.make_id,c.make_name,c.model_id,c.model_name,c.colour,c.entrust_id, " +
        " e.short_name,e.entrust_name,csr.enter_time,csr.real_out_time, " +
        " so.day_count,so.hour_count,so.plan_fee,so.actual_fee" +
        " from order_payment_rel opr" +
        " left join storage_order so on opr.storage_order_id = so.id " +
        " left join order_payment op on opr.order_payment_id = op.id " +
        " left join car_storage_rel csr on so.car_storage_rel_id = csr.id " +
        " left join car_info c on so.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " where opr.id is not null ";
    var paramsArray=[],i=0;
    if(params.orderPaymentId){
        paramsArray[i++] = params.orderPaymentId;
        query = query + " and opr.order_payment_id = ? ";
    }
    query = query + ' group by opr.id ';
    query = query + ' order by opr.storage_order_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getOrderPaymentRel ');
        return callback(error,rows);
    });
}

function deleteOrderPaymentRel(params,callback){
    var query = " delete from order_payment_rel where storage_order_id = ? and order_payment_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageOrderId;
    paramsArray[i]=params.orderPaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteOrderPaymentRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addOrderPaymentRel : addOrderPaymentRel,
    getOrderPaymentRel : getOrderPaymentRel,
    deleteOrderPaymentRel : deleteOrderPaymentRel
}