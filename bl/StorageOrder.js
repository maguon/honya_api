/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageOrderDAO = require('../dao/StorageOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageOrder.js');

function queryStorageOrder(req,res,next){
    var params = req.params ;
    storageOrderDAO.getStorageOrder(params,function(error,result){
        if (error) {
            logger.error(' queryStorageOrder ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageOrder ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateStorageOrderActualFee(req,res,next){
    var params = req.params ;
    storageOrderDAO.updateStorageOrderActualFee(params,function(error,result){
        if (error) {
            logger.error(' updateStorageOrderActualFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorageOrderActualFee ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateStorageOrderStatus(req,res,next){
    var params = req.params ;
    storageOrderDAO.updateStorageOrderStatus(params,function(error,result){
        if (error) {
            logger.error(' updateStorageOrderStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorageOrderStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryStorageOrder : queryStorageOrder,
    updateStorageOrderActualFee : updateStorageOrderActualFee,
    updateStorageOrderStatus : updateStorageOrderStatus
}