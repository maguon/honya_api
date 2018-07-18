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

function getInvoiceStorageOrderRel(params,callback) {
    var query = " select isor.*,c.vin,csr.enter_time,csr.real_out_time,so.day_count,so.actual_fee " +
        " from invoice_storage_order_rel isor" +
        " left join storage_order so on isor.storage_order_id = so.id " +
        " left join car_info c on so.car_id = c.id " +
        " left join car_storage_rel csr on so.car_storage_rel_id = csr.id " +
        " where isor.id is not null ";
    var paramsArray=[],i=0;
    if(params.invoiceId){
        paramsArray[i++] = params.invoiceId;
        query = query + " and isor.invoice_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getInvoiceStorageOrderRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addInvoiceStorageOrderRel : addInvoiceStorageOrderRel,
    getInvoiceStorageOrderRel : getInvoiceStorageOrderRel
}
