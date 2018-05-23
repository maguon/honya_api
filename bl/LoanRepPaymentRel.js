/**
 * Created by zwl on 2018/5/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var loanRepPaymentRelDAO = require('../dao/LoanRepPaymentRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanRepPaymentRel.js');

function createLoanRepPaymentRel(req,res,next){
    var params = req.params ;
    loanRepPaymentRelDAO.addLoanRepPaymentRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "支付编号已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createLoanRepPaymentRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createLoanRepPaymentRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryLoanRepPaymentRel(req,res,next){
    var params = req.params ;
    loanRepPaymentRelDAO.getLoanRepPaymentRel(params,function(error,result){
        if (error) {
            logger.error(' queryLoanRepPaymentRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanRepPaymentRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateRepPaymentMoney(req,res,next){
    var params = req.params ;
    loanRepPaymentRelDAO.updateRepPaymentMoney(params,function(error,result){
        if (error) {
            logger.error(' updateRepPaymentMoney ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateRepPaymentMoney ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeLoanRepPaymentRel(req,res,next){
    var params = req.params;
    loanRepPaymentRelDAO.deleteLoanRepPaymentRel(params,function(error,result){
        if (error) {
            logger.error(' removeLoanRepPaymentRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeLoanRepPaymentRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createLoanRepPaymentRel : createLoanRepPaymentRel,
    queryLoanRepPaymentRel : queryLoanRepPaymentRel,
    updateRepPaymentMoney : updateRepPaymentMoney,
    removeLoanRepPaymentRel : removeLoanRepPaymentRel
}
