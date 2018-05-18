/**
 * Created by zwl on 2018/5/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var financialLoanDAO = require('../dao/FinancialLoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialLoan.js');

function createFinancialLoan(req,res,next){
    var params = req.params ;
    financialLoanDAO.addFinancialLoan(params,function(error,result){
        if (error) {
            logger.error(' createFinancialLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createFinancialLoan ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryFinancialLoan(req,res,next){
    var params = req.params ;
    financialLoanDAO.getFinancialLoan(params,function(error,result){
        if (error) {
            logger.error(' queryFinancialLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryFinancialLoan ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createFinancialLoan : createFinancialLoan,
    queryFinancialLoan : queryFinancialLoan
}