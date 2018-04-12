/**
 * Created by zwl on 2018/4/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageOrderPaymentDAO.js');

function addStorageOrderPayment(params,callback){
    var query = " insert into storage_order_payment (entrust_id,payment_type,number,payment_money,remark) values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.paymentType;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.paymentMoney;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addStorageOrderPayment ');
        return callback(error,rows);
    });
}

function getStorageOrderPayment(params,callback) {
    var query = " select sop.*,e.short_name,e.entrust_name from storage_order_payment sop " +
        " left join entrust_info e on sop.entrust_id = e.id " +
        " where sop.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageOrderPaymentId){
        paramsArray[i++] = params.storageOrderPaymentId;
        query = query + " and sop.id = ? ";
    }
    if(params.entrustType){
        paramsArray[i++] = params.entrustType;
        query = query + " and e.entrust_type = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and sop.entrust_id = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and sop.payment_status = ? ";
    }
    if(params.paymentType){
        paramsArray[i++] = params.paymentType;
        query = query + " and sop.payment_type = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and sop.number = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and sop.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and sop.created_on <= ? ";
    }
    query = query + " order by sop.id ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageOrderPayment ');
        return callback(error,rows);
    });
}

function updateStorageOrderPayment(params,callback){
    var query = " update storage_order_payment set entrust_id = ? , payment_type = ? , number = ? , payment_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.paymentType;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.paymentMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.storageOrderPaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageOrderPayment ');
        return callback(error,rows);
    });
}


module.exports ={
    addStorageOrderPayment : addStorageOrderPayment,
    getStorageOrderPayment : getStorageOrderPayment,
    updateStorageOrderPayment : updateStorageOrderPayment
}
