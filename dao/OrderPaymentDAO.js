/**
 * Created by zwl on 2018/4/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('OrderPaymentDAO.js');

function addOrderPayment(params,callback){
    var query = " insert into order_payment (entrust_id,payment_type,number,payment_money,payment_user_id,remark) values ( ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.paymentType;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.paymentMoney;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addOrderPayment ');
        return callback(error,rows);
    });
}

function getOrderPayment(params,callback) {
    var query = " select op.*,e.entrust_type,e.short_name,e.entrust_name,u.real_name as payment_user_name from order_payment op " +
        " left join entrust_info e on op.entrust_id = e.id " +
        " left join user_info u on op.payment_user_id = u.uid " +
        " left join order_payment_rel opr on op.id = opr.order_payment_id " +
        " where op.id is not null ";
    var paramsArray=[],i=0;
    if(params.orderPaymentId){
        paramsArray[i++] = params.orderPaymentId;
        query = query + " and op.id = ? ";
    }
    if(params.entrustType){
        paramsArray[i++] = params.entrustType;
        query = query + " and e.entrust_type = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and op.entrust_id = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and op.payment_status = ? ";
    }
    if(params.paymentType){
        paramsArray[i++] = params.paymentType;
        query = query + " and op.payment_type = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and op.number = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and op.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and op.created_on <= ? ";
    }
    if(params.storageOrderId){
        paramsArray[i++] = params.storageOrderId;
        query = query + " and opr.storage_order_id = ? ";
    }
    query = query + " group by op.id ";
    query = query + " order by op.id desc ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getOrderPayment ');
        return callback(error,rows);
    });
}

function updateOrderPayment(params,callback){
    var query = " update order_payment set entrust_id = ? , payment_type = ? , number = ? , payment_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.paymentType;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.paymentMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.orderPaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateOrderPayment ');
        return callback(error,rows);
    });
}

function updateOrderPaymentStatus(params,callback){
    var query = " update order_payment set date_id = ? , payment_end_date = ? , payment_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.paymentEndDate;
    paramsArray[i++]=params.paymentStatus;
    paramsArray[i]=params.orderPaymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateOrderPaymentStatus ');
        return callback(error,rows);
    });
}

function getOrderPaymentCount(params,callback) {
    var query = " select count(id) as payment_count,sum(payment_money) as payment_money from order_payment where id is not null ";
    var paramsArray=[],i=0;
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and payment_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getOrderPaymentCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addOrderPayment : addOrderPayment,
    getOrderPayment : getOrderPayment,
    updateOrderPayment : updateOrderPayment,
    updateOrderPaymentStatus : updateOrderPaymentStatus,
    getOrderPaymentCount : getOrderPaymentCount
}
