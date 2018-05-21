/**
 * Created by zwl on 2018/5/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var financialCreditDAO = require('../dao/FinancialCreditDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialCredit.js');

function createFinancialCredit(req,res,next){
    var params = req.params ;
    financialCreditDAO.addFinancialCredit(params,function(error,result){
        if (error) {
            logger.error(' createFinancialCredit ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createFinancialCredit ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryFinancialCredit(req,res,next){
    var params = req.params ;
    financialCreditDAO.getFinancialCredit(params,function(error,result){
        if (error) {
            logger.error(' queryFinancialCredit ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryFinancialCredit ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateFinancialCreditStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.creditEndDate = myDate;
    financialCreditDAO.updateFinancialCreditStatus(params,function(error,result){
        if (error) {
            logger.error(' updateFinancialCreditStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateFinancialCreditStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createFinancialCredit : createFinancialCredit,
    queryFinancialCredit : queryFinancialCredit,
    updateFinancialCreditStatus : updateFinancialCreditStatus
}
