/**
 * Created by zwl on 2018/7/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceLoanRepRelDAO.js');

function addInvoiceLoanRepRel(params,callback){
    var query = " insert into invoice_loan_rep_rel (repayment_id,invoice_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repaymentId;
    paramsArray[i]=params.invoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addInvoiceLoanRepRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addInvoiceLoanRepRel : addInvoiceLoanRepRel
}
