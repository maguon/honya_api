/**
 * Created by zwl on 2018/5/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var loanRepaymentDAO = require('../dao/LoanRepaymentDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanRepayment.js');

function createLoanRepayment(req,res,next){
    var params = req.params ;
    loanRepaymentDAO.addLoanRepayment(params,function(error,result){
        if (error) {
            logger.error(' createLoanRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createLoanRepayment ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryLoanRepayment(req,res,next){
    var params = req.params ;
    loanRepaymentDAO.getLoanRepayment(params,function(error,result){
        if (error) {
            logger.error(' queryLoanRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanRepayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createLoanRepayment : createLoanRepayment,
    queryLoanRepayment : queryLoanRepayment
}