/**
 * Created by zwl on 2017/4/11.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarMakeDAO.js');

function addCarMake(params,callback){
    var query = " insert into car_make (make_name) values (?) ";
    var paramsArray=[],i=0;
    paramsArray[i]=params.makeName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarMake ');
        return callback(error,rows);
    });
}

function getCarMake(params,callback) {
    var query = " select * from car_make where id is not null ";
    var paramsArray=[],i=0;
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and id = ? ";
    }
    if(params.makeName){
        paramsArray[i++] = params.makeName;
        query = query + " and make_name = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarMake ');
        return callback(error,rows);
    });
}

function updateCarMake(params,callback){
    var query = " update car_make set make_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.makeName;
    paramsArray[i]=params.makeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarMake ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarMake : addCarMake,
    getCarMake : getCarMake,
    updateCarMake : updateCarMake
}