/**
 * Created by zwl on 2018/7/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var invoiceShipOrderRelDAO = require('../dao/InvoiceShipOrderRelDAO.js');
var shipTransOrderDAO = require('../dao/ShipTransOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceShipOrderRel.js');

function createInvoiceShipOrderRel(req,res,next){
    var params = req.params ;
    var relId = 0;
    Seq().seq(function(){
        var that = this;
        invoiceShipOrderRelDAO.addInvoiceShipOrderRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "订单编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createInvoiceShipOrderRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createInvoiceShipOrderRel ' + 'success');
                    relId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createInvoiceShipOrderRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.invoiceStatus = sysConst.INVOICE_STATUS.grant;
        shipTransOrderDAO.updateShipTransOrderInvoiceStatus(params,function(error,result){
            if (error) {
                logger.error(' updateShipTransOrderInvoiceStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateShipTransOrderInvoiceStatus ' + 'success');
                }else{
                    logger.warn(' updateShipTransOrderInvoiceStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createInvoiceShipOrderRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:relId},null);
        return next();
    })
}

function queryInvoiceShipOrderRel(req,res,next){
    var params = req.params ;
    invoiceShipOrderRelDAO.getInvoiceShipOrderRel(params,function(error,result){
        if (error) {
            logger.error(' queryInvoiceShipOrderRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryInvoiceShipOrderRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeInvoiceShipOrderRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        invoiceShipOrderRelDAO.deleteInvoiceShipOrderRel(params,function(error,result){
            if (error) {
                logger.error(' removeInvoiceShipOrderRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeInvoiceShipOrderRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeInvoiceShipOrderRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.invoiceStatus = sysConst.INVOICE_STATUS.not_grant;
        shipTransOrderDAO.updateShipTransOrderInvoiceStatus(params,function(error,result){
            if (error) {
                logger.error(' updateShipTransOrderInvoiceStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateShipTransOrderInvoiceStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createInvoiceShipOrderRel : createInvoiceShipOrderRel,
    queryInvoiceShipOrderRel : queryInvoiceShipOrderRel,
    removeInvoiceShipOrderRel : removeInvoiceShipOrderRel
}
