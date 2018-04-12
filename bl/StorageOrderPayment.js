/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageOrderPaymentDAO = require('../dao/StorageOrderPaymentDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageOrderPayment.js');

function createStorageOrderPayment(req,res,next){
    var params = req.params ;
    storageOrderPaymentDAO.addStorageOrderPayment(params,function(error,result){
        if (error) {
            logger.error(' createStorageOrderPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createStorageOrderPayment ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryStorageOrderPayment(req,res,next){
    var params = req.params ;
    storageOrderPaymentDAO.getStorageOrderPayment(params,function(error,result){
        if (error) {
            logger.error(' queryStorageOrderPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageOrderPayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateStorageOrderPayment(req,res,next){
    var params = req.params ;
    storageOrderPaymentDAO.updateStorageOrderPayment(params,function(error,result){
        if (error) {
            logger.error(' updateStorageOrderPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorageOrderPayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateStorageOrderPaymentStatus(req,res,next){
    var params = req.params ;
    storageOrderPaymentDAO.updateStorageOrderPaymentStatus(params,function(error,result){
        if (error) {
            logger.error(' updateStorageOrderPaymentStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorageOrderPaymentStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createStorageOrderPayment : createStorageOrderPayment,
    queryStorageOrderPayment : queryStorageOrderPayment,
    updateStorageOrderPayment : updateStorageOrderPayment,
    updateStorageOrderPaymentStatus : updateStorageOrderPaymentStatus
}
