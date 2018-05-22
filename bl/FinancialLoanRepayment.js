/**
 * Created by zwl on 2018/5/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var financialLoanRepaymentDAO = require('../dao/FinancialLoanRepaymentDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialLoanRepayment.js');

function createFinancialLoanRepayment(req,res,next){
    var params = req.params ;
    financialLoanRepaymentDAO.addFinancialLoanRepayment(params,function(error,result){
        if (error) {
            logger.error(' createFinancialLoanRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createFinancialLoanRepayment ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryFinancialLoanRepayment(req,res,next){
    var params = req.params ;
    financialLoanRepaymentDAO.getFinancialLoanRepayment(params,function(error,result){
        if (error) {
            logger.error(' queryFinancialLoanRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryFinancialLoanRepayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createFinancialLoanRepayment : createFinancialLoanRepayment,
    queryFinancialLoanRepayment : queryFinancialLoanRepayment
}