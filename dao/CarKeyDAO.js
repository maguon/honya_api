/**
 * Created by zwl on 2018/3/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyDAO.js');

function addCarKey(params,callback){
    var query = " insert into car_key_info (key_name,remark) values ( ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.keyName;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarKey ');
        return callback(error,rows);
    });
}

function getCarKey(params,callback) {
    var query = " select * from car_key_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.carKeyId){
        paramsArray[i++] = params.carKeyId;
        query = query + " and id = ? ";
    }
    if(params.keyName){
        paramsArray[i++] = params.keyName;
        query = query + " and key_name = ? ";
    }
    if(params.keyStatus){
        paramsArray[i++] = params.keyStatus;
        query = query + " and key_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarKey ');
        return callback(error,rows);
    });
}

function updateCarKey(params,callback){
    var query = " update car_key_info set key_name = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.keyName;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.carKeyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarKey ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarKey : addCarKey,
    getCarKey : getCarKey,
    updateCarKey : updateCarKey
}