/**
 * Created by zwl on 2017/4/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('BrandDAO.js');

function addBrand(params,callback){
    var query = " insert into truck_brand (brand_name)  values (?)";
    var paramsArray=[],i=0;
    paramsArray[i]=params.brandName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addBrand ');
        return callback(error,rows);
    });
}

function getBrand(params,callback) {
    var query = " select * from truck_brand where id is not null ";
    var paramsArray=[],i=0;
    if(params.brandId){
        paramsArray[i++] = params.brandId;
        query = query + " and id = ? ";
    }
    if(params.brandName){
        paramsArray[i++] = params.brandName;
        query = query + " and brand_name = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getBrand ');
        return callback(error,rows);
    });
}

function updateBrand(params,callback){
    var query = " update truck_brand set brand_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.brandName;
    paramsArray[i]=params.brandId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateBrand ');
        return callback(error,rows);
    });
}


module.exports ={
    addBrand : addBrand,
    getBrand : getBrand,
    updateBrand : updateBrand
}
