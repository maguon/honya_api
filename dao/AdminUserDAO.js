var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AdminUserDAO.js');

function queryAdminUser(params,callback){
    var query = " select * from admin_user where id is not null ";
    var paramsArray=[],i=0;
    if(params.adminId){
        paramsArray[i++] = params.adminId;
        query = query + " and id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? ";
    }

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' queryAdminUser ');
        return callback(error,rows);
    });
}

function queryAdminInfo(params,callback){
    var query = " select * from admin_user where id is not null";
    var paramsArray=[],i=0;
    if(params.adminId){
        query = query + " and id = ? "
        paramsArray[i++]=params.adminId;
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' queryUser ');
        return callback(error,rows);
    });
}

function updateInfo(params,callback){
    var query = " update admin_user set real_name = ? ,mobile = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.realName;
    paramsArray[i++] = params.mobile;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateInfo ');
        return callback(error,rows);
    });
}

function updatePassword(params,callback){
    var query = " update admin_user set password = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.password;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updatePassword ');
        return callback(error,rows);
    });

}

module.exports = {
    queryAdminUser : queryAdminUser,
    queryAdminInfo : queryAdminInfo,
    updateInfo : updateInfo,
    updatePassword : updatePassword
}