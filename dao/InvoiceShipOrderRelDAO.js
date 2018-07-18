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

function getInvoiceShipOrderRel(params,callback) {
    var query = " select isor.*,c.vin,st.start_port_name,st.end_port_name,st.actual_start_date,st.actual_end_date,sto.ship_trans_fee " +
        " from invoice_ship_order_rel isor " +
        " left join ship_trans_order sto on isor.ship_trans_order_id = sto.id " +
        " left join car_info c on sto.car_id = c.id " +
        " left join ship_trans_info st on sto.ship_trans_id = st.id " +
        " where isor.id is not null ";
    var paramsArray=[],i=0;
    if(params.invoiceId){
        paramsArray[i++] = params.invoiceId;
        query = query + " and isor.invoice_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getInvoiceShipOrderRel ');
        return callback(error,rows);
    });
}

function deleteInvoiceShipOrderRel(params,callback){
    var query = " delete from invoice_ship_order_rel where ship_trans_order_id = ? and invoice_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipTransOrderId;
    paramsArray[i]=params.invoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteInvoiceShipOrderRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addInvoiceShipOrderRel : addInvoiceShipOrderRel,
    getInvoiceShipOrderRel : getInvoiceShipOrderRel,
    deleteInvoiceShipOrderRel : deleteInvoiceShipOrderRel
}
