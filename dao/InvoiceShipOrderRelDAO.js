/**
 * Created by zwl on 2018/7/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceShipOrderRelDAO.js');

function addInvoiceShipOrderRel(params,callback){
    var query = " insert into invoice_ship_order_rel (ship_trans_order_id,invoice_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransOrderId;
    paramsArray[i]=params.invoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addInvoiceShipOrderRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addInvoiceShipOrderRel : addInvoiceShipOrderRel
}
