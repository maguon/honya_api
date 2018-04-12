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


module.exports ={
    addStorageOrderPaymentRel : addStorageOrderPaymentRel
}