/**
 * Created by zwl on 2018/7/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var invoiceLoanRepRelDAO = require('../dao/InvoiceLoanRepRelDAO.js');
var loanRepaymentDAO = require('../dao/LoanRepaymentDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceLoanRepRel.js');

function createInvoiceLoanRepRel(req,res,next){
    var params = req.params ;
    var relId = 0;
    Seq().seq(function(){
        var that = this;
        invoiceLoanRepRelDAO.addInvoiceLoanRepRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "还款编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createInvoiceLoanRepRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createInvoiceLoanRepRel ' + 'success');
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
        loanRepaymentDAO.updateLoanRepaymentInvoiceStatus(params,function(error,result){
            if (error) {
                logger.error(' updateLoanRepaymentInvoiceStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateLoanRepaymentInvoiceStatus ' + 'success');
                }else{
                    logger.warn(' updateLoanRepaymentInvoiceStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createInvoiceLoanRepRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:relId},null);
        return next();
    })
}

function queryInvoiceLoanRepRel(req,res,next){
    var params = req.params ;
    invoiceLoanRepRelDAO.getInvoiceLoanRepRel(params,function(error,result){
        if (error) {
            logger.error(' queryInvoiceLoanRepRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryInvoiceLoanRepRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryInvoiceLoanRepRelList(req,res,next){
    var params = req.params ;
    invoiceLoanRepRelDAO.getInvoiceLoanRepRelList(params,function(error,result){
        if (error) {
            logger.error(' queryInvoiceLoanRepRelList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryInvoiceLoanRepRelList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeInvoiceLoanRepRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        invoiceLoanRepRelDAO.deleteInvoiceLoanRepRel(params,function(error,result){
            if (error) {
                logger.error(' removeInvoiceLoanRepRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeInvoiceLoanRepRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeInvoiceLoanRepRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.invoiceStatus = sysConst.INVOICE_STATUS.not_grant;
        loanRepaymentDAO.updateLoanRepaymentInvoiceStatus(params,function(error,result){
            if (error) {
                logger.error(' updateLoanRepaymentInvoiceStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateLoanRepaymentInvoiceStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createInvoiceLoanRepRel : createInvoiceLoanRepRel,
    queryInvoiceLoanRepRel : queryInvoiceLoanRepRel,
    queryInvoiceLoanRepRelList : queryInvoiceLoanRepRelList,
    removeInvoiceLoanRepRel : removeInvoiceLoanRepRel
}
