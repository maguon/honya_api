/**
 * Created by zwl on 2018/4/9.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var portDAO = require('../dao/PortDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Port.js');

function createPort(req,res,next){
    var params = req.params ;
    portDAO.addPort(params,function(error,result){
        if (error) {
            logger.error(' createPort ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createPort ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryPort(req,res,next){
    var params = req.params ;
    portDAO.getPort(params,function(error,result){
        if (error) {
            logger.error(' queryPort ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryPort ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updatePort(req,res,next){
    var params = req.params ;
    portDAO.updatePort(params,function(error,result){
        if (error) {
            logger.error(' updatePort ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updatePort ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createPort : createPort,
    queryPort : queryPort,
    updatePort : updatePort
}
