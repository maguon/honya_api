/**
 * Created by zwl on 2018/4/26.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var shipTransOrderPaymentRelDAO = require('../dao/ShipTransOrderPaymentRelDAO.js');
var shipTransOrderDAO = require('../dao/ShipTransOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrderPaymentRel.js');

function createShipTransOrderPaymentRel(req,res,next){
    var params = req.params ;
    var orderPaymentRelId = 0;
    Seq().seq(function(){
        var that = this;
        shipTransOrderPaymentRelDAO.addShipTransOrderPaymentRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "订单编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createShipTransOrderPaymentRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createShipTransOrderPaymentRel ' + 'success');
                    orderPaymentRelId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createShipTransOrderPaymentRel failed");
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
        logger.info(' createShipTransOrderPaymentRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:orderPaymentRelId},null);
        return next();
    })
}

function queryShipTransOrderPaymentRel(req,res,next){
    var params = req.params ;
    shipTransOrderPaymentRelDAO.getShipTransOrderPaymentRel(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransOrderPaymentRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransOrderPaymentRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeShipTransOrderPaymentRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        shipTransOrderPaymentRelDAO.deleteShipTransOrderPaymentRel(params,function(error,result){
            if (error) {
                logger.error(' removeShipTransOrderPaymentRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeShipTransOrderPaymentRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeShipTransOrderPaymentRel ' + 'failed');
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
    createShipTransOrderPaymentRel : createShipTransOrderPaymentRel,
    queryShipTransOrderPaymentRel : queryShipTransOrderPaymentRel,
    removeShipTransOrderPaymentRel : removeShipTransOrderPaymentRel
}
