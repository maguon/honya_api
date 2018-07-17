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

function getInvoice(params,callback) {
    var query = " select i.*,e.short_name,e.entrust_type,u.real_name as invoice_user_name " +
        " from invoice_info i " +
        " left join entrust_info e on i.entrust_id = e.id " +
        " left join user_info u on i.invoice_user_id = u.uid " +
        " where i.id is not null ";
    var paramsArray=[],i=0;
    if(params.invoiceId){
        paramsArray[i++] = params.invoiceId;
        query = query + " and i.id = ? ";
    }
    if(params.invoiceNum){
        paramsArray[i++] = params.invoiceNum;
        query = query + " and i.invoice_num = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and i.entrust_id = ? ";
    }
    if(params.invoiceStatus){
        paramsArray[i++] = params.invoiceStatus;
        query = query + " and i.invoice_status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and i.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and i.created_on <= ? ";
    }
    if(params.grantDateStart){
        paramsArray[i++] = params.grantDateStart +" 00:00:00";
        query = query + " and i.grant_date >= ? ";
    }
    if(params.grantDateEnd){
        paramsArray[i++] = params.grantDateEnd +" 23:59:59";
        query = query + " and i.grant_date <= ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getInvoice ');
        return callback(error,rows);
    });
}

function updateInvoice(params,callback){
    var query = " update invoice_info set invoice_num = ? , invoice_money = ? , entrust_id = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.invoiceNum;
    paramsArray[i++]=params.invoiceMoney;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.invoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateInvoice ');
        return callback(error,rows);
    });
}


module.exports ={
    addInvoice : addInvoice,
    getInvoice : getInvoice,
    updateInvoice : updateInvoice
}
