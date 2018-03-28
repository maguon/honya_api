/**
 * Created by zwl on 2018/3/28.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var entrustDAO = require('../dao/EntrustDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Entrust.js');

function createEntrust(req,res,next){
    var params = req.params ;
    entrustDAO.addEntrust(params,function(error,result){
        if (error) {
            logger.error(' createEntrust ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createEntrust ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryEntrust(req,res,next){
    var params = req.params ;
    entrustDAO.getEntrust(params,function(error,result){
        if (error) {
            logger.error(' queryEntrust ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrust ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateEntrust(req,res,next){
    var params = req.params ;
    entrustDAO.updateEntrust(params,function(error,result){
        if (error) {
            logger.error(' updateEntrust ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateEntrust ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createEntrust : createEntrust,
    queryEntrust : queryEntrust,
    updateEntrust : updateEntrust
}