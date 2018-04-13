/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var orderPaymentRelDAO = require('../dao/OrderPaymentRelDAO.js');
var storageOrderDAO = require('../dao/StorageOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('OrderPaymentRel.js');

function createOrderPaymentRel(req,res,next){
    var params = req.params ;
    var orderPaymentRelId = 0;
    Seq().seq(function(){
        var that = this;
        orderPaymentRelDAO.addOrderPaymentRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "订单编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createOrderPaymentRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createOrderPaymentRel ' + 'success');
                    orderPaymentRelId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createOrderPaymentRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.orderStatus = sysConst.ORDER_STATUS.payment;
        storageOrderDAO.updateStorageOrderStatus(params,function(error,result){
            if (error) {
                logger.error(' updateStorageOrderStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageOrderStatus ' + 'success');
                }else{
                    logger.warn(' updateStorageOrderStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createOrderPaymentRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:orderPaymentRelId},null);
        return next();
    })
}

function queryOrderPaymentRel(req,res,next){
    var params = req.params ;
    orderPaymentRelDAO.getOrderPaymentRel(params,function(error,result){
        if (error) {
            logger.error(' queryOrderPaymentRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryOrderPaymentRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeOrderPaymentRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        orderPaymentRelDAO.deleteOrderPaymentRel(params,function(error,result){
            if (error) {
                logger.error(' removeOrderPaymentRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeOrderPaymentRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeOrderPaymentRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.orderStatus = sysConst.ORDER_STATUS.not_payment;
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
    })
}


module.exports = {
    createOrderPaymentRel : createOrderPaymentRel,
    queryOrderPaymentRel : queryOrderPaymentRel,
    removeOrderPaymentRel : removeOrderPaymentRel
}