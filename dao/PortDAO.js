/**
 * Created by zwl on 2018/4/9.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('PortDAO.js');

function addPort(params,callback){
    var query = " insert into port_info (port_name,country_id,address,remark) values ( ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.portName;
    paramsArray[i++]=params.countryId;
    paramsArray[i++]=params.address;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addPort ');
        return callback(error,rows);
    });
}

function getPort(params,callback) {
    var query = " select p.* from port_info p " +
        " left join country_info c on p.country_id = c.id " +
        " where p.id is not null ";
    var paramsArray=[],i=0;
    if(params.portId){
        paramsArray[i++] = params.portId;
        query = query + " and p.id = ? ";
    }
    if(params.portName){
        paramsArray[i++] = params.portName;
        query = query + " and p.port_name = ? ";
    }
    if(params.countryId){
        paramsArray[i++] = params.countryId;
        query = query + " and p.country_id = ? ";
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
    var query = " update port_info set port_name = ? , country_id = ? , address = ?, remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.portName;
    paramsArray[i++]=params.countryId;
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