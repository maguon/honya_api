/**
 * Created by zwl on 2018/5/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var paymentLoanRepRelDAO = require('../dao/PaymentLoanRepRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('PaymentLoanRepRel.js');

function createPaymentLoanRepRel(req,res,next){
    var params = req.params ;
    paymentLoanRepRelDAO.addPaymentLoanRepRel(params,function(error,result){
        if (error) {
            logger.error(' createPaymentLoanRepRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createPaymentLoanRepRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryPaymentLoanRepRel(req,res,next){
    var params = req.params ;
    paymentLoanRepRelDAO.getPaymentLoanRepRel(params,function(error,result){
        if (error) {
            logger.error(' queryPaymentLoanRepRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryPaymentLoanRepRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryPaymentRepMoney(req,res,next){
    var params = req.params ;
    paymentLoanRepRelDAO.getPaymentRepMoney(params,function(error,result){
        if (error) {
            logger.error(' queryPaymentRepMoney ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryPaymentRepMoney ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updatePaymentRepMoney(req,res,next){
    var params = req.params ;
    paymentLoanRepRelDAO.updatePaymentRepMoney(params,function(error,result){
        if (error) {
            logger.error(' updatePaymentRepMoney ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updatePaymentRepMoney ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removePaymentLoanRepRel(req,res,next){
    var params = req.params;
    paymentLoanRepRelDAO.deletePaymentLoanRepRel(params,function(error,result){
        if (error) {
            logger.error(' removePaymentLoanRepRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removePaymentLoanRepRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createPaymentLoanRepRel : createPaymentLoanRepRel,
    queryPaymentLoanRepRel : queryPaymentLoanRepRel,
    queryPaymentRepMoney : queryPaymentRepMoney,
    updatePaymentRepMoney : updatePaymentRepMoney,
    removePaymentLoanRepRel : removePaymentLoanRepRel
}

