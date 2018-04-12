/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageOrderPaymentDAO = require('../dao/StorageOrderPaymentDAO.js');
var storageOrderPaymentRelDAO = require('../dao/StorageOrderPaymentRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageOrderPayment.js');

function createPayment(req,res,next){
    var params = req.params ;
    var storageOrderPaymentId = 0;
    Seq().seq(function(){
        var that = this;
        storageOrderPaymentDAO.addStorageOrderPayment(params,function(error,result){
            if (error) {
                logger.error(' createPayment ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createPayment ' + 'success');
                    storageOrderPaymentId = result.insertId;
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
                storageOrderPaymentId : storageOrderPaymentId,
                storageOrderId : storageOrderIds[i],
                row : i+1,
            }
            storageOrderPaymentRelDAO.addStorageOrderPaymentRel(subParams,function(err,result){
                if (err) {
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "订单已经被关联，操作失败");
                        return next();
                    } else{
                        logger.error(' createStorageOrderPaymentRel ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createStorageOrderPaymentRel ' + 'success');
                    }else{
                        logger.warn(' createStorageOrderPaymentRel ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createDamageInsure ' + 'success');
        resUtil.resetCreateRes(res,{insertId:storageOrderPaymentId},null);
        return next();
    })
}

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
    createPayment : createPayment,
    createStorageOrderPayment : createStorageOrderPayment,
    queryStorageOrderPayment : queryStorageOrderPayment,
    updateStorageOrderPayment : updateStorageOrderPayment,
    updateStorageOrderPaymentStatus : updateStorageOrderPaymentStatus
}
