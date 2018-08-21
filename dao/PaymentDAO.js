/**
 * Created by zwl on 2018/4/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('PaymentDAO.js');

function addPayment(params,callback){
    var query = " insert into payment_info (entrust_id,payment_type,number,payment_money,payment_user_id,remark) values ( ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.paymentType;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.paymentMoney;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addPayment ');
        return callback(error,rows);
    });
}

function getPayment(params,callback) {
    var query = " select p.*,e.entrust_type,e.short_name,e.entrust_name,u.real_name as payment_user_name " +
        " from payment_info p " +
        " left join entrust_info e on p.entrust_id = e.id " +
        " left join user_info u on p.payment_user_id = u.uid " +
        " left join payment_storage_order_rel ptor on p.id = ptor.payment_id " +
        " left join payment_ship_order_rel psor on p.id = psor.payment_id " +
        " where p.id is not null ";
    var paramsArray=[],i=0;
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and p.id = ? ";
    }
    if(params.entrustType){
        paramsArray[i++] = params.entrustType;
        query = query + " and e.entrust_type = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and p.entrust_id = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and p.payment_status = ? ";
    }
    if(params.paymentType){
        paramsArray[i++] = params.paymentType;
        query = query + " and p.payment_type = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and p.number = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and p.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and p.created_on <= ? ";
    }
    if(params.storageOrderId){
        paramsArray[i++] = params.storageOrderId;
        query = query + " and ptor.storage_order_id = ? ";
    }
    if(params.shipTransOrderId){
        paramsArray[i++] = params.shipTransOrderId;
        query = query + " and psor.ship_trans_order_id = ? ";
    }
    query = query + " group by p.id ";
    query = query + " order by p.id desc ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getPayment ');
        return callback(error,rows);
    });
}

function updatePayment(params,callback){
    var query = " update payment_info set entrust_id = ? , payment_type = ? , number = ? , payment_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.paymentType;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.paymentMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updatePayment ');
        return callback(error,rows);
    });
}

function updatePaymentStatus(params,callback){
    var query = " update payment_info set date_id = ? , payment_end_date = ? , payment_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.paymentEndDate;
    paramsArray[i++]=params.paymentStatus;
    paramsArray[i]=params.paymentId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updatePaymentStatus ');
        return callback(error,rows);
    });
}

function getPaymentCount(params,callback) {
    var query = " select count(id) as payment_count,sum(payment_money) as payment_money from payment_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and payment_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getPaymentCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addPayment : addPayment,
    getPayment : getPayment,
    updatePayment : updatePayment,
    updatePaymentStatus : updatePaymentStatus,
    getPaymentCount : getPaymentCount
}
