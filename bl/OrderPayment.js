/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var orderPaymentDAO = require('../dao/OrderPaymentDAO.js');
var orderPaymentRelDAO = require('../dao/OrderPaymentRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('OrderPayment.js');

function createPayment(req,res,next){
    var params = req.params ;
    var orderPaymentId = 0;
    Seq().seq(function(){
        var that = this;
        orderPaymentDAO.addOrderPayment(params,function(error,result){
            if (error) {
                logger.error(' createPayment ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createPayment ' + 'success');
                    orderPaymentId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create payment failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var storageOrderIds = params.storageOrderIds;
        var rowArray = [] ;
        rowArray.length= storageOrderIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                orderPaymentId : orderPaymentId,
                storageOrderId : storageOrderIds[i],
                row : i+1,
            }
            orderPaymentRelDAO.addOrderPaymentRel(subParams,function(err,result){
                if (err) {
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "订单已经被关联，操作失败");
                        return next();
                    } else{
                        logger.error(' createOrderPaymentRel ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createOrderPaymentRel ' + 'success');
                    }else{
                        logger.warn(' createOrderPaymentRel ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createOrderPaymentRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:orderPaymentId},null);
        return next();
    })
}

function createOrderPayment(req,res,next){
    var params = req.params ;
    orderPaymentDAO.addOrderPayment(params,function(error,result){
        if (error) {
            logger.error(' createOrderPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createOrderPayment ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryOrderPayment(req,res,next){
    var params = req.params ;
    orderPaymentDAO.getOrderPayment(params,function(error,result){
        if (error) {
            logger.error(' queryOrderPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryOrderPayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateOrderPayment(req,res,next){
    var params = req.params ;
    orderPaymentDAO.updateOrderPayment(params,function(error,result){
        if (error) {
            logger.error(' updateOrderPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateOrderPayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateOrderPaymentStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.paymentEndDate = myDate;
    orderPaymentDAO.updateOrderPaymentStatus(params,function(error,result){
        if (error) {
            logger.error(' updateOrderPaymentStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateOrderPaymentStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createPayment : createPayment,
    createOrderPayment : createOrderPayment,
    queryOrderPayment : queryOrderPayment,
    updateOrderPayment : updateOrderPayment,
    updateOrderPaymentStatus : updateOrderPaymentStatus
}
