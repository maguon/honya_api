/**
 * Created by zwl on 2018/3/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyPositionDAO.js');

function addCarKeyPosition(params,callback){
    var query = " insert into car_key_position (car_key_cabinet_id,car_key_cabinet_area_id,row,col) values (? , ? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carKeyCabinetId;
    paramsArray[i++]=params.areaId;
    paramsArray[i++]=params.row;
    paramsArray[i]=params.col;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarKeyPosition ');
        return callback(error,rows);
    });
}

function getCarKeyPosition(params,callback) {
    var query = " select ckp.*,ckc.key_cabinet_name,ckca.area_name from car_key_position ckp " +
        " left join car_key_cabinet_info ckc on ckp.car_key_cabinet_id = ckc.id " +
        " left join car_key_cabinet_area ckca on ckp.car_key_cabinet_area_id = ckca.id " +
        " where ckp.id is not null ";
    var paramsArray=[],i=0;
    if(params.carKeyPositionId){
        paramsArray[i++] = params.carKeyPositionId;
        query = query + " and ckp.id = ? ";
    }
    if(params.carKeyCabinetId){
        paramsArray[i++] = params.carKeyCabinetId;
        query = query + " and ckp.car_key_cabinet_id = ? ";
    }
    if(params.areaId){
        paramsArray[i++] = params.areaId;
        query = query + " and ckp.car_key_cabinet_area_id = ? ";
    }
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and ckp.car_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarKeyPosition ');
        return callback(error,rows);
    });
}

function getCarKeyPositionBase(params,callback) {
    var query = " select * from car_key_position where car_id >0 and id is not null ";
    var paramsArray=[],i=0;
    if(params.carKeyPositionId){
        paramsArray[i++] = params.carKeyPositionId;
        query = query + " and id = ? ";
    }
    if(params.carKeyCabinetId){
        paramsArray[i++] = params.carKeyCabinetId;
        query = query + " and car_key_cabinet_id = ? ";
    }
    if(params.areaId){
        paramsArray[i++] = params.areaId;
        query = query + " and car_key_cabinet_area_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarKeyPositionBase ');
        return callback(error,rows);
    });
}

function getCarKeyPositionCount(params,callback) {
    var query = " select count(ckp.id) as position_count from car_key_position ckp where ckp.car_id =0 and ckp.id is not null ";
    var paramsArray=[],i=0;
    if(params.carKeyCabinetId){
        paramsArray[i++] = params.carKeyCabinetId;
        query = query + " and ckp.car_key_cabinet_id = ? ";
    }
    if(params.areaId){
        paramsArray[i++] = params.areaId;
        query = query + " and ckp.car_key_cabinet_area_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarKeyPositionCount ');
        return callback(error,rows);
    });
}

function updateCarKeyPosition(params,callback){
    var query = " update car_key_position set car_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carId;
    paramsArray[i]=params.carKeyPositionId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarKeyPosition ');
        return callback(error,rows);
    });
}

function updateCarKeyPositionMove(params,callback){
    var query = " update car_key_position set car_id = 0 where car_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarKeyPositionMove ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarKeyPosition : addCarKeyPosition,
    getCarKeyPosition : getCarKeyPosition,
    getCarKeyPositionBase : getCarKeyPositionBase,
    getCarKeyPositionCount : getCarKeyPositionCount,
    updateCarKeyPosition : updateCarKeyPosition,
    updateCarKeyPositionMove : updateCarKeyPositionMove
}
