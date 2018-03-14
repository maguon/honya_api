var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AppDAO.js');

function queryApp(params,callback){
    var query = " select id,app,type,version,force_update,url,remark,created_on,updated_on from app_version where id is not null ";
    var paramsArray=[],i=0;
    if(params.type){
        query = query + " and type = ? "
        paramsArray[i++]=params.type;
    }
    if(params.app){
        query = query + " and app = ? "
        paramsArray[i++]=params.app;
    }
    query = query + '  order by id desc ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' queryApp ');
        return callback(error,rows);
    });
}

module.exports ={
    queryApp : queryApp
}
