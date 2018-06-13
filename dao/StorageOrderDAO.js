/**
 * Created by zwl on 2018/4/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageOrderDAO.js');

function addStorageOrder(params,callback){
    var query = " insert into storage_order (car_storage_rel_id,car_id,day_count,hour_count,plan_fee,actual_fee,storage_order_user_id) values ( ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.relId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.dayCount;
    paramsArray[i++]=params.hourCount;
    paramsArray[i++]=params.planFee;
    paramsArray[i++]=params.actualFee;
    paramsArray[i]=params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addStorageOrder ');
        return callback(error,rows);
    });
}

function getStorageOrder(params,callback) {
    var query = " select so.*,u.real_name as storage_order_user_name,c.vin,c.make_id,c.make_name,c.model_id,c.model_name,c.colour,c.entrust_id, " +
        " e.short_name,e.entrust_name,csr.enter_time,csr.real_out_time, " +
        " p.id as payment_id,p.payment_type,p.number,p.payment_money,p.remark,p.created_on as payment_date,p.payment_status " +
        " from storage_order so " +
        " left join car_storage_rel csr on so.car_storage_rel_id = csr.id " +
        " left join car_info c on so.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join payment_storage_order_rel ptor on so.id = ptor.storage_order_id " +
        " left join payment_info p on ptor.payment_id = p.id " +
        " left join user_info u on so.storage_order_user_id = u.uid " +
        " where so.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageOrderId){
        paramsArray[i++] = params.storageOrderId;
        query = query + " and so.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.modelId){
        paramsArray[i++] = params.modelId;
        query = query + " and c.model_id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.enterStart){
        paramsArray[i++] = params.enterStart +" 00:00:00";
        query = query + " and  csr.enter_time  >= ? ";
    }
    if(params.enterEnd){
        paramsArray[i++] = params.enterEnd +" 23:59:59";
        query = query + " and csr.enter_time  <= ? ";
    }
    if(params.realStart){
        paramsArray[i++] = params.realStart +" 00:00:00";
        query = query + " and csr.real_out_time >= ? ";
    }
    if(params.realEnd){
        paramsArray[i++] = params.realEnd +" 23:59:59";
        query = query + " and csr.real_out_time <= ? ";
    }
    if(params.orderStatus){
        paramsArray[i++] = params.orderStatus;
        query = query + " and so.order_status = ? ";
    }
    query = query + " group by so.id ";
    query = query + " order by so.id ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageOrder ');
        return callback(error,rows);
    });
}

function updateStorageOrderActualFee(params,callback){
    var query = " update storage_order set actual_fee = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.actualFee;
    paramsArray[i]=params.storageOrderId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageOrderActualFee ');
        return callback(error,rows);
    });
}

function updateStorageOrderStatus(params,callback){
    var query = " update storage_order set order_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.orderStatus;
    paramsArray[i]=params.storageOrderId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageOrderStatus ');
        return callback(error,rows);
    });
}

function getStorageOrderCount(params,callback) {
    var query = " select count(id) as order_count , sum(actual_fee) as actual_fee from storage_order where id is not null ";
    var paramsArray=[],i=0;
    if(params.orderStatus){
        paramsArray[i++] = params.orderStatus;
        query = query + " and order_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageOrderCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addStorageOrder : addStorageOrder,
    getStorageOrder : getStorageOrder,
    updateStorageOrderActualFee : updateStorageOrderActualFee,
    updateStorageOrderStatus : updateStorageOrderStatus,
    getStorageOrderCount : getStorageOrderCount
}
