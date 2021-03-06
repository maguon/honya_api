/**
 * Created by zwl on 2018/3/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carKeyCabinetDAO = require('../dao/CarKeyCabinetDAO.js');
var carKeyPositionDAO = require('../dao/CarKeyPositionDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyCabinet.js');

function createCarKeyCabinet(req,res,next){
    var params = req.params ;
    carKeyCabinetDAO.addCarKeyCabinet(params,function(error,result){
        if (error) {
            logger.error(' createCarKeyCabinet ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCarKeyCabinet ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCarKeyCabinet(req,res,next){
    var params = req.params ;
    carKeyCabinetDAO.getCarKeyCabinet(params,function(error,result){
        if (error) {
            logger.error(' queryCarKeyCabinet ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarKeyCabinet ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarKeyCabinet(req,res,next){
    var params = req.params ;
    carKeyCabinetDAO.updateCarKeyCabinet(params,function(error,result){
        if (error) {
            logger.error(' updateCarKeyCabinet ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarKeyCabinet ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCarKeyCabinetStatus(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        carKeyPositionDAO.getCarKeyPositionBase(params,function(error,rows){
            if (error) {
                logger.error(' getCarKeyPositionBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    logger.warn(' getCarKeyPositionBase ' + 'failed');
                    resUtil.resetFailedRes(res,"还有未清空的位置，禁止停用");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        carKeyCabinetDAO.updateCarKeyCabinetStatus(params,function(error,result){
            if (error) {
                logger.error(' updateCarKeyCabinetStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarKeyCabinetStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createCarKeyCabinet : createCarKeyCabinet,
    queryCarKeyCabinet : queryCarKeyCabinet,
    updateCarKeyCabinet : updateCarKeyCabinet,
    updateCarKeyCabinetStatus : updateCarKeyCabinetStatus
}
