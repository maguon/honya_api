/**
 * Created by zwl on 2018/3/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyAreaDAO.js');

function addCarKeyArea(params,callback){
    var query = " insert into car_key_area (car_key_id,area_name,row,col) values (? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carKeyId;
    paramsArray[i++]=params.areaName;
    paramsArray[i++]=params.row;
    paramsArray[i++]=params.col;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarKeyArea ');
        return callback(error,rows);
    });
}

function getCarKeyArea(params,callback) {
    var query = " select cka.*,ck.key_name from car_key_area cka " +
        " left join car_key_info ck on cka.car_key_id = ck.id where cka.id is not null ";
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
    if(params.carKeyId){
        paramsArray[i++] = params.carKeyId;
        query = query + " and cka.car_key_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarKeyArea ');
        return callback(error,rows);
    });
}

function updateCarKeyArea(params,callback){
    var query = " update car_key_area set area_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.areaName;
    paramsArray[i]=params.areaId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarKeyArea ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarKeyArea : addCarKeyArea,
    getCarKeyArea : getCarKeyArea,
    updateCarKeyArea : updateCarKeyArea
}
