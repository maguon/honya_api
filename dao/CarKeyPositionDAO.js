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
    getCarKeyPositionBase : getCarKeyPositionBase,
    updateCarKeyPosition : updateCarKeyPosition,
    updateCarKeyPositionMove : updateCarKeyPositionMove
}
