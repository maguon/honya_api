/**
 * Created by zwl on 2018/4/26.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var paymentShipOrderRelDAO = require('../dao/PaymentShipOrderRelDAO.js');
var shipTransOrderDAO = require('../dao/ShipTransOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('PaymentShipOrderRel.js');

function createPaymentShipOrderRel(req,res,next){
    var params = req.params ;
    var orderPaymentRelId = 0;
    Seq().seq(function(){
        var that = this;
        paymentShipOrderRelDAO.addPaymentShipOrderRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "订单编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createPaymentShipOrderRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createPaymentShipOrderRel ' + 'success');
                    orderPaymentRelId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createPaymentShipOrderRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.orderStatus = sysConst.ORDER_STATUS.payment;
        shipTransOrderDAO.updateShipTransOrderStatus(params,function(error,result){
            if (error) {
                logger.error(' updateShipTransOrderStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateShipTransOrderStatus ' + 'success');
                }else{
                    logger.warn(' updateShipTransOrderStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createPaymentShipOrderRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:orderPaymentRelId},null);
        return next();
    })
}

function queryPaymentShipOrderRel(req,res,next){
    var params = req.params ;
    paymentShipOrderRelDAO.getPaymentShipOrderRel(params,function(error,result){
        if (error) {
            logger.error(' queryPaymentShipOrderRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryPaymentShipOrderRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removePaymentShipOrderRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        paymentShipOrderRelDAO.deletePaymentShipOrderRel(params,function(error,result){
            if (error) {
                logger.error(' removePaymentShipOrderRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removePaymentShipOrderRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removePaymentShipOrderRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.orderStatus = sysConst.ORDER_STATUS.not_payment;
        shipTransOrderDAO.updateShipTransOrderStatus(params,function(error,result){
            if (error) {
                logger.error(' updateShipTransOrderStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateShipTransOrderStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createPaymentShipOrderRel : createPaymentShipOrderRel,
    queryPaymentShipOrderRel : queryPaymentShipOrderRel,
    removePaymentShipOrderRel : removePaymentShipOrderRel
}
