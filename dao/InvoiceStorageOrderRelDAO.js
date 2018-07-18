/**
 * Created by zwl on 2018/7/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceStorageOrderRelDAO.js');

function addInvoiceStorageOrderRel(params,callback){
    var query = " insert into invoice_storage_order_rel (storage_order_id,invoice_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageOrderId;
    paramsArray[i]=params.invoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addInvoiceStorageOrderRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addInvoiceStorageOrderRel : addInvoiceStorageOrderRel
}
