/**
 * Created by zwl on 2018/5/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var loanRepCreditRelDAO = require('../dao/LoanRepCreditRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanRepCreditRel.js');

function createLoanRepCreditRel(req,res,next){
    var params = req.params ;
    loanRepCreditRelDAO.addLoanRepCreditRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "信用证已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createLoanRepCreditRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createLoanRepCreditRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryLoanRepCreditRel(req,res,next){
    var params = req.params ;
    loanRepCreditRelDAO.getLoanRepCreditRel(params,function(error,result){
        if (error) {
            logger.error(' queryLoanRepCreditRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanRepCreditRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeLoanRepCreditRel(req,res,next){
    var params = req.params;
    loanRepCreditRelDAO.deleteLoanRepCreditRel(params,function(error,result){
        if (error) {
            logger.error(' removeLoanRepCreditRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeLoanRepCreditRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createLoanRepCreditRel : createLoanRepCreditRel,
    queryLoanRepCreditRel : queryLoanRepCreditRel,
    removeLoanRepCreditRel : removeLoanRepCreditRel
}
