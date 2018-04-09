/**
 * Created by zwl on 2018/4/9.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('PortDAO.js');

function addPort(params,callback){
    var query = " insert into port_info (port_name,country_name,address,remark) values ( ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.portName;
    paramsArray[i++]=params.countryName;
    paramsArray[i++]=params.address;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addPort ');
        return callback(error,rows);
    });
}

function getPort(params,callback) {
    var query = " select * from port_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.portId){
        paramsArray[i++] = params.portId;
        query = query + " and id = ? ";
    }
    if(params.portName){
        paramsArray[i++] = params.portName;
        query = query + " and port_name = ? ";
    }
    if(params.countryName){
        paramsArray[i++] = params.countryName;
        query = query + " and country_name = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getPort ');
        return callback(error,rows);
    });
}

function updatePort(params,callback){
    var query = " update port_info set port_name = ? , country_name = ? , address = ?, remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.portName;
    paramsArray[i++]=params.countryName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.portId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updatePort ');
        return callback(error,rows);
    });
}


module.exports ={
    addPort : addPort,
    getPort : getPort,
    updatePort : updatePort
}