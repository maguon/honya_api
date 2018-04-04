/**
 * Created by zwl on 2018/4/4.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageAreaDAO.js');

function addStorageArea(params,callback){
    var query = " insert into storage_area (storage_id,area_name,row,col,lot,remark) values (? , ? , ? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageId;
    paramsArray[i++]=params.areaName;
    paramsArray[i++]=params.row;
    paramsArray[i++]=params.col;
    paramsArray[i++]=params.lot;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addStorageArea ');
        return callback(error,rows);
    });
}

function getStorageArea(params,callback) {
    var query = " select sa.*,s.storage_name from storage_area sa" +
        " left join storage_info s on sa.storage_id = s.id where sa.id is not null ";
    var paramsArray=[],i=0;
    if(params.areaId){
        paramsArray[i++] = params.areaId;
        query = query + " and sa.id = ? ";
    }
    if(params.areaName){
        paramsArray[i++] = params.areaName;
        query = query + " and sa.area_name = ? ";
    }
    if(params.areaStatus){
        paramsArray[i++] = params.areaStatus;
        query = query + " and sa.area_status = ? ";
    }
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and sa.storage_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageArea ');
        return callback(error,rows);
    });
}

function updateStorageArea(params,callback){
    var query = " update storage_area set area_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.areaName;
    paramsArray[i]=params.areaId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageArea ');
        return callback(error,rows);
    });
}

function updateStorageAreaStatus(params,callback){
    var query = " update storage_area set area_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.areaStatus;
    paramsArray[i] = params.areaId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageAreaStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addStorageArea : addStorageArea,
    getStorageArea : getStorageArea,
    updateStorageArea : updateStorageArea,
    updateStorageAreaStatus : updateStorageAreaStatus
}