/**
 * Created by zwl on 2018/4/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageOrderDAO.js');

function getStorageOrder(params,callback) {
    var query = " select so.*,c.vin,c.make_id,c.make_name,c.model_id,c.model_name,c.entrust_id, " +
        " e.short_name,e.entrust_name,csr.enter_time,csr.real_out_time from storage_order so " +
        " left join car_info c on so.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join car_storage_rel csr on c.id = csr.car_id " +
        " where csr.active = 1 and so.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageOrderId){
        paramsArray[i++] = params.storageOrderId;
        query = query + " and so.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
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


module.exports ={
    getStorageOrder : getStorageOrder,
    updateStorageOrderActualFee : updateStorageOrderActualFee
}
