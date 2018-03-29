/**
 * Created by zwl on 2018/3/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carKeyDAO = require('../dao/CarKeyDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKey.js');

function createCarKey(req,res,next){
    var params = req.params ;
    carKeyDAO.addCarKey(params,function(error,result){
        if (error) {
            logger.error(' createCarKey ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCarKey ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCarKey(req,res,next){
    var params = req.params ;
    carKeyDAO.getCarKey(params,function(error,result){
        if (error) {
            logger.error(' queryCarKey ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarKey ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarKey(req,res,next){
    var params = req.params ;
    carKeyDAO.updateCarKey(params,function(error,result){
        if (error) {
            logger.error(' updateCarKey ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarKey ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarKey : createCarKey,
    queryCarKey : queryCarKey,
    updateCarKey : updateCarKey
}
