var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var listOfValue = require('../util/ListOfValue.js');
var appDAO = require('../dao/AppDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('App.js');


function queryApp(req,res,next){
    var params = req.params ;
    appDAO.queryApp(params,function(error,result){
        if (error) {
            logger.error(' queryApp ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryApp ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports={
    queryApp : queryApp
}