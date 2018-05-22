/**
 * Created by zwl on 2018/5/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var financialLoanRepCreditRelDAO = require('../dao/FinancialLoanRepCreditRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialLoanRepCreditRel.js');

function createFinancialLoanRepCreditRel(req,res,next){
    var params = req.params ;
    financialLoanRepCreditRelDAO.addFinancialLoanRepCreditRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "信用证已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createFinancialLoanRepCreditRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createFinancialLoanRepCreditRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryFinancialLoanRepCreditRel(req,res,next){
    var params = req.params ;
    financialLoanRepCreditRelDAO.getFinancialLoanRepCreditRel(params,function(error,result){
        if (error) {
            logger.error(' queryFinancialLoanRepCreditRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryFinancialLoanRepCreditRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeFinancialLoanRepCreditRel(req,res,next){
    var params = req.params;
    financialLoanRepCreditRelDAO.deleteFinancialLoanRepCreditRel(params,function(error,result){
        if (error) {
            logger.error(' removeFinancialLoanRepCreditRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeFinancialLoanRepCreditRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createFinancialLoanRepCreditRel : createFinancialLoanRepCreditRel,
    queryFinancialLoanRepCreditRel : queryFinancialLoanRepCreditRel,
    removeFinancialLoanRepCreditRel : removeFinancialLoanRepCreditRel
}
