var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AppDAO.js');

function queryApp(params,callback){
    var query = " select id,app,type,version,version_number,floor_version_number,force_update,url,remark,created_on,updated_on from app_version where id is not null ";
    var paramsArray=[],i=0;
    if(params.type){
        query = query + " and type = ? ";
        paramsArray[i++]=params.type;
    }
    if(params.app){
        query = query + " and app = ? ";
        paramsArray[i++]=params.app;
    }
    query = query + '  order by id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' queryApp ');
        return callback(error,rows);
    });
}

function addAppVersion(params,callback){
    var query = " insert into app_version (app,type,version,version_number,floor_version_number,force_update,url,remark)  values (? , ? , ? , ? , ? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.app;
    paramsArray[i++]=params.appType;
    paramsArray[i++]=params.version;
    paramsArray[i++]=params.versionNumber;
    paramsArray[i++]=params.floorVersionNumber;
    paramsArray[i++]=params.forceUpdate;
    paramsArray[i++]=params.url;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addAppVersion ');
        return callback(error,rows);
    });
}

function updateAppVersion(params,callback){
    var query = " update app_version set app = ? , type = ? , version = ? ," +
        "  version_number = ? , floor_version_number = ? , force_update = ? , url = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.app;
    paramsArray[i++]=params.appType;
    paramsArray[i++]=params.version;
    paramsArray[i++]=params.versionNumber;
    paramsArray[i++]=params.floorVersionNumber;
    paramsArray[i++]=params.forceUpdate;
    paramsArray[i++]=params.url;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.appId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateAppVersion ');
        return callback(error,rows);
    });
}


module.exports ={
    queryApp : queryApp,
    addAppVersion : addAppVersion,
    updateAppVersion : updateAppVersion
}
