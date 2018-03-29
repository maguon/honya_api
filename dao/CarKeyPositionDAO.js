/**
 * Created by zwl on 2018/3/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyPositionDAO.js');

function addCarKeyPosition(params,callback){
    var query = " insert into car_key_position (car_key_id,car_key_area_id,row,col) values (? , ? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carKeyId;
    paramsArray[i++]=params.areaId;
    paramsArray[i++]=params.row;
    paramsArray[i]=params.col;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarKeyPosition ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarKeyPosition : addCarKeyPosition
}
