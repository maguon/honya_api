/**
 * Created by zwl on 2018/7/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceDAO.js');

function addInvoice(params,callback){
    var query = " insert into invoice_info (invoice_num,invoice_money,entrust_id,invoice_user_id,remark) values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.invoiceNum;
    paramsArray[i++]=params.invoiceMoney;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addInvoice ');
        return callback(error,rows);
    });
}


module.exports ={
    addInvoice : addInvoice
}
