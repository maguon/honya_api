/**
 * Created by zwl on 2017/4/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CityDAO.js');

function addCity(params,callback){
    var query = " insert into city_info (city_name)  values (?)";
    var paramsArray=[],i=0;
    paramsArray[i]=params.cityName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCity ');
        return callback(error,rows);
    });
}

function getCity(params,callback) {
    var query = " select * from city_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and id = ? ";
    }
    if(params.cityName){
        paramsArray[i++] = params.cityName;
        query = query + " and city_name = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCity ');
        return callback(error,rows);
    });
}

function updateCity(params,callback){
    var query = " update city_info set city_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.cityName;
    paramsArray[i]=params.cityId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCity ');
        return callback(error,rows);
    });
}



module.exports ={
    addCity : addCity,
    getCity : getCity,
    updateCity : updateCity
}