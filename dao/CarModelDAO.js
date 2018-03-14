/**
 * Created by zwl on 2017/4/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarModelDAO.js');

function addCarModel(params,callback){
    var query = " insert into car_model (make_id,model_name) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.makeId;
    paramsArray[i]=params.modelName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarModel ');
        return callback(error,rows);
    });
}

function getCarModel(params,callback) {
    var query = " select mo.* from car_model mo left join car_make ma on mo.make_id = ma.id where mo.id is not null ";
    var paramsArray=[],i=0;
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and ma.id = ? ";
    }
    query = query + '  order by mo.model_status desc ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarModel ');
        return callback(error,rows);
    });
}

function updateCarModel(params,callback){
    var query = " update car_model set model_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.modelName;
    paramsArray[i]=params.modelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarModel ');
        return callback(error,rows);
    });
}

function updateModelStatus(params,callback){
    var query = " update car_model set model_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.modelStatus;
    paramsArray[i] = params.modelId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateModelStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarModel : addCarModel,
    getCarModel : getCarModel,
    updateCarModel : updateCarModel,
    updateModelStatus : updateModelStatus
}