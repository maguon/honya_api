/**
 * Created by zwl on 2018/4/11.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipCompanyDAO.js');

function addShipCompany(params,callback){
    var query = " insert into ship_company_info (ship_company_name) values ( ? )";
    var paramsArray=[],i=0;
    paramsArray[i]=params.shipCompanyName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addShipCompany ');
        return callback(error,rows);
    });
}

function getShipCompany(params,callback) {
    var query = " select * from ship_company_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.shipCompanyId){
        paramsArray[i++] = params.shipCompanyId;
        query = query + " and id = ? ";
    }
    if(params.shipCompanyName){
        paramsArray[i++] = params.shipCompanyName;
        query = query + " and ship_company_name = ? ";
    }
    if(params.shipCompanyStatus){
        paramsArray[i++] = params.shipCompanyStatus;
        query = query + " and ship_company_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getShipCompany ');
        return callback(error,rows);
    });
}

function updateShipCompany(params,callback){
    var query = " update ship_company_info set  ship_company_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shipCompanyName;
    paramsArray[i]=params.shipCompanyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateShipCompany ');
        return callback(error,rows);
    });
}

function updateShipCompanyStatus(params,callback){
    var query = " update ship_company_info set ship_company_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.shipCompanyStatus;
    paramsArray[i] = params.shipCompanyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateShipCompanyStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addShipCompany : addShipCompany,
    getShipCompany : getShipCompany,
    updateShipCompany : updateShipCompany,
    updateShipCompanyStatus : updateShipCompanyStatus
}
