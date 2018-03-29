/**
 * Created by zwl on 2018/3/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyCabinetDAO.js');

function addCarKeyCabinet(params,callback){
    var query = " insert into car_key_cabinet_info (key_cabinet_name,remark) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.keyCabinetName;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarKeyCabinet ');
        return callback(error,rows);
    });
}

function getCarKeyCabinet(params,callback) {
    var query = " select * from car_key_cabinet_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.carKeyCabinetId){
        paramsArray[i++] = params.carKeyCabinetId;
        query = query + " and id = ? ";
    }
    if(params.keyCabinetName){
        paramsArray[i++] = params.keyCabinetName;
        query = query + " and key_cabinet_name = ? ";
    }
    if(params.keyCabinetStatus){
        paramsArray[i++] = params.keyCabinetStatus;
        query = query + " and key_cabinet_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarKeyCabinet ');
        return callback(error,rows);
    });
}

function updateCarKeyCabinet(params,callback){
    var query = " update car_key_cabinet_info set key_cabinet_name = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.keyCabinetName;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.carKeyCabinetId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarKeyCabinet ');
        return callback(error,rows);
    });
}

function updateCarKeyCabinetStatus(params,callback){
    var query = " update car_key_cabinet_info set key_cabinet_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.keyCabinetStatus;
    paramsArray[i] = params.carKeyCabinetId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarKeyCabinetStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarKeyCabinet : addCarKeyCabinet,
    getCarKeyCabinet : getCarKeyCabinet,
    updateCarKeyCabinet : updateCarKeyCabinet,
    updateCarKeyCabinetStatus : updateCarKeyCabinetStatus
}