/**
 * Created by zwl on 2018/7/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var invoiceStorageOrderRelDAO = require('../dao/InvoiceStorageOrderRelDAO.js');
var storageOrderDAO = require('../dao/StorageOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceStorageOrderRel.js');

function createInvoiceStorageOrderRel(req,res,next){
    var params = req.params ;
    var relId = 0;
    Seq().seq(function(){
        var that = this;
        invoiceStorageOrderRelDAO.addInvoiceStorageOrderRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "订单编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createInvoiceStorageOrderRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createInvoiceStorageOrderRel ' + 'success');
                    relId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createInvoiceStorageOrderRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.invoiceStatus = sysConst.INVOICE_STATUS.grant;
        storageOrderDAO.updateStorageOrderInvoiceStatus(params,function(error,result){
            if (error) {
                logger.error(' updateStorageOrderInvoiceStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageOrderInvoiceStatus ' + 'success');
                }else{
                    logger.warn(' updateStorageOrderInvoiceStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createInvoiceStorageOrderRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:relId},null);
        return next();
    })
}

function queryInvoiceStorageOrderRel(req,res,next){
    var params = req.params ;
    invoiceStorageOrderRelDAO.getInvoiceStorageOrderRel(params,function(error,result){
        if (error) {
            logger.error(' queryInvoiceStorageOrderRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryInvoiceStorageOrderRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeInvoiceStorageOrderRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        invoiceStorageOrderRelDAO.deleteInvoiceStorageOrderRel(params,function(error,result){
            if (error) {
                logger.error(' removeInvoiceStorageOrderRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeInvoiceStorageOrderRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeInvoiceStorageOrderRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.invoiceStatus = sysConst.INVOICE_STATUS.not_grant;
        storageOrderDAO.updateStorageOrderInvoiceStatus(params,function(error,result){
            if (error) {
                logger.error(' updateStorageOrderInvoiceStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateStorageOrderInvoiceStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createInvoiceStorageOrderRel : createInvoiceStorageOrderRel,
    queryInvoiceStorageOrderRel : queryInvoiceStorageOrderRel,
    removeInvoiceStorageOrderRel : removeInvoiceStorageOrderRel
}