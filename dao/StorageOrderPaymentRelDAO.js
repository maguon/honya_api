/**
 * Created by zwl on 2018/4/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageOrderPaymentRelDAO.js');

function addStorageOrderPaymentRel(params,callback){
    var query = " insert into storage_order_payment_rel (storage_order_id,storage_order_payment_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageOrderId;
    paramsArray[i]=params.storageOrderPaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addStorageOrderPaymentRel ');
        return callback(error,rows);
    });
}

function getStorageOrderPaymentRel(params,callback) {
    var query = " select sopr.*,c.vin,c.make_id,c.make_name,c.model_id,c.model_name,c.entrust_id, " +
        " e.short_name,e.entrust_name,csr.enter_time,csr.real_out_time, " +
        " so.day_count,so.hour_count,so.plan_fee,so.actual_fee" +
        " from storage_order_payment_rel sopr" +
        " left join storage_order so on sopr.storage_order_id = so.id " +
        " left join storage_order_payment sop on sopr.storage_order_payment_id = sop.id " +
        " left join car_info c on so.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join car_storage_rel csr on c.id = csr.car_id " +
        " where csr.active = 1 and sopr.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageOrderPaymentId){
        paramsArray[i++] = params.storageOrderPaymentId;
        query = query + " and sopr.storage_order_payment_id = ? ";
    }
    query = query + ' group by sopr.id,csr.id ';
    query = query + ' order by sopr.storage_order_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageOrderPaymentRel ');
        return callback(error,rows);
    });
}

function deleteStorageOrderPaymentRel(params,callback){
    var query = " delete from storage_order_payment_rel where storage_order_id = ? and storage_order_payment_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageOrderId;
    paramsArray[i]=params.storageOrderPaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteStorageOrderPaymentRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addStorageOrderPaymentRel : addStorageOrderPaymentRel,
    getStorageOrderPaymentRel : getStorageOrderPaymentRel,
    deleteStorageOrderPaymentRel : deleteStorageOrderPaymentRel
}