/**
 * Created by zwl on 2018/3/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyCabinetAreaDAO.js');

function addCarKeyCabinetArea(params,callback){
    var query = " insert into car_key_cabinet_area (car_key_cabinet_id,area_name,row,col) values (? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carKeyCabinetId;
    paramsArray[i++]=params.areaName;
    paramsArray[i++]=params.row;
    paramsArray[i++]=params.col;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarKeyCabinetArea ');
        return callback(error,rows);
    });
}

function getCarKeyCabinetArea(params,callback) {
    var query = " select cka.*,ckc.key_cabinet_name from car_key_cabinet_area cka " +
        " left join car_key_cabinet_info ckc on cka.car_key_cabinet_id = ckc.id where cka.id is not null ";
    var paramsArray=[],i=0;
    if(params.areaId){
        paramsArray[i++] = params.areaId;
        query = query + " and cka.id = ? ";
    }
    if(params.areaName){
        paramsArray[i++] = params.areaName;
        query = query + " and cka.area_name = ? ";
    }
    if(params.areaStatus){
        paramsArray[i++] = params.areaStatus;
        query = query + " and cka.area_status = ? ";
    }
    if(params.carKeyCabinetId){
        paramsArray[i++] = params.carKeyCabinetId;
        query = query + " and cka.car_key_cabinet_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarKeyCabinetArea ');
        return callback(error,rows);
    });
}

function updateCarKeyCabinetArea(params,callback){
    var query = " update car_key_cabinet_area set area_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.areaName;
    paramsArray[i]=params.areaId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarKeyCabinetArea ');
        return callback(error,rows);
    });
}

function updateCarKeyCabinetAreaStatus(params,callback){
    var query = " update car_key_cabinet_area set area_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.areaStatus;
    paramsArray[i] = params.areaId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarKeyCabinetAreaStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarKeyCabinetArea : addCarKeyCabinetArea,
    getCarKeyCabinetArea : getCarKeyCabinetArea,
    updateCarKeyCabinetArea : updateCarKeyCabinetArea,
    updateCarKeyCabinetAreaStatus : updateCarKeyCabinetAreaStatus
}
