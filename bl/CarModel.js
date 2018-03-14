/**
 * Created by zwl on 2017/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carModelDAO = require('../dao/CarModelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarModel.js');

function createCarModel(req,res,next){
    var params = req.params ;
    carModelDAO.addCarModel(params,function(error,result){
        if (error) {
            logger.error(' createCarModel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCarModel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCarModel(req,res,next){
    var params = req.params ;
    carModelDAO.getCarModel(params,function(error,result){
        if (error) {
            logger.error(' queryCarModel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarModel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarModel(req,res,next){
    var params = req.params ;
    carModelDAO.updateCarModel(params,function(error,result){
        if (error) {
            logger.error(' updateCarModel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarModel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateModelStatus (req,res,next){
    var params = req.params;
    carModelDAO.updateModelStatus(params,function(error,result){
        if (error) {
            logger.error(' updateModelStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateModelStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarModel : createCarModel,
    queryCarModel : queryCarModel,
    updateCarModel : updateCarModel,
    updateModelStatus : updateModelStatus
}