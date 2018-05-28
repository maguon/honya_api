/**
 * Created by zwl on 2018/4/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('PaymentStorageOrderRelDAO.js');

function addPaymentStorageOrderRel(params,callback){
    var query = " insert into payment_storage_order_rel (storage_order_id,payment_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageOrderId;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addPaymentStorageOrderRel ');
        return callback(error,rows);
    });
}

function getPaymentStorageOrderRel(params,callback) {
    var query = " select ptor.*,c.vin,c.make_id,c.make_name,c.model_id,c.model_name,c.colour,c.entrust_id, " +
        " e.short_name,e.entrust_name,csr.enter_time,csr.real_out_time, " +
        " so.day_count,so.hour_count,so.plan_fee,so.actual_fee" +
        " from payment_storage_order_rel ptor" +
        " left join storage_order so on ptor.storage_order_id = so.id " +
        " left join payment_info p on ptor.payment_id = p.id " +
        " left join car_storage_rel csr on so.car_storage_rel_id = csr.id " +
        " left join car_info c on so.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " where ptor.id is not null ";
    var paramsArray=[],i=0;
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and ptor.payment_id = ? ";
    }
    query = query + ' group by ptor.id ';
    query = query + ' order by ptor.storage_order_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getPaymentStorageOrderRel ');
        return callback(error,rows);
    });
}

function deletePaymentStorageOrderRel(params,callback){
    var query = " delete from payment_storage_order_rel where storage_order_id = ? and payment_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageOrderId;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deletePaymentStorageOrderRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addPaymentStorageOrderRel : addPaymentStorageOrderRel,
    getPaymentStorageOrderRel : getPaymentStorageOrderRel,
    deletePaymentStorageOrderRel : deletePaymentStorageOrderRel
}