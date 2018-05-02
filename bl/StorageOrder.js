/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
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
    Seq().seq(function(){
        var that = this;
        storageOrderDAO.getStorageOrder(params,function(error,rows){
            if (error) {
                logger.error(' getStorageOrder ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0&&rows[0].payment_status == sysConst.PAYMENT_STATUS.completed){
                    logger.warn(' getStorageOrder ' + 'failed');
                    resUtil.resetFailedRes(res," 订单支付已完结，不能进行修改 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
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

function queryStorageOrderCount(req,res,next){
    var params = req.params ;
    storageOrderDAO.getStorageOrderCount(params,function(error,result){
        if (error) {
            logger.error(' queryStorageOrderCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageOrderCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryStorageOrder : queryStorageOrder,
    updateStorageOrderActualFee : updateStorageOrderActualFee,
    updateStorageOrderStatus : updateStorageOrderStatus,
    queryStorageOrderCount : queryStorageOrderCount
}
