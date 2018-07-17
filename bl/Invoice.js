/**
 * Created by zwl on 2018/7/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var invoiceDAO = require('../dao/InvoiceDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('Invoice.js');

function createInvoice(req,res,next){
    var params = req.params ;
    invoiceDAO.addInvoice(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "发票编号已经存在，请重新输入");
                return next();
            } else{
                logger.error(' createInvoice ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createInvoice ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryInvoice(req,res,next){
    var params = req.params ;
    invoiceDAO.getInvoice(params,function(error,result){
        if (error) {
            logger.error(' queryInvoice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryInvoice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateInvoice(req,res,next){
    var params = req.params ;
    invoiceDAO.updateInvoice(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "发票编号已经存在，请重新输入");
                return next();
            } else{
                logger.error(' updateInvoice ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' updateInvoice ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateInvoiceStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.grantDate = myDate;
    invoiceDAO.updateInvoiceStatus(params,function(error,result){
        if (error) {
            logger.error(' updateInvoiceStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateInvoiceStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createInvoice : createInvoice,
    queryInvoice : queryInvoice,
    updateInvoice : updateInvoice,
    updateInvoiceStatus : updateInvoiceStatus
}