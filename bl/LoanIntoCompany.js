/**
 * Created by zwl on 2018/6/4.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var loanIntoCompanyDAO = require('../dao/LoanIntoCompanyDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanIntoCompany.js');

function createLoanIntoCompany(req,res,next){
    var params = req.params ;
    loanIntoCompanyDAO.addLoanIntoCompany(params,function(error,result){
        if (error) {
            logger.error(' createLoanIntoCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createLoanIntoCompany ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryLoanIntoCompany(req,res,next){
    var params = req.params ;
    loanIntoCompanyDAO.getLoanIntoCompany(params,function(error,result){
        if (error) {
            logger.error(' queryLoanIntoCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanIntoCompany ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryLoanIntoCompanyTotalMoney(req,res,next){
    var params = req.params ;
    loanIntoCompanyDAO.getLoanIntoCompanyTotalMoney(params,function(error,result){
        if (error) {
            logger.error(' queryLoanIntoCompanyTotalMoney ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanIntoCompanyTotalMoney ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateLoanIntoCompany(req,res,next){
    var params = req.params ;
    loanIntoCompanyDAO.updateLoanIntoCompany(params,function(error,result){
        if (error) {
            logger.error(' updateLoanIntoCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanIntoCompany ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateLoanIntoCompanyStatus(req,res,next){
    var params = req.params;
    loanIntoCompanyDAO.updateLoanIntoCompanyStatus(params,function(error,result){
        if (error) {
            logger.error(' updateLoanIntoCompanyStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanIntoCompanyStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createLoanIntoCompany : createLoanIntoCompany,
    queryLoanIntoCompany : queryLoanIntoCompany,
    queryLoanIntoCompanyTotalMoney : queryLoanIntoCompanyTotalMoney,
    updateLoanIntoCompany : updateLoanIntoCompany,
    updateLoanIntoCompanyStatus : updateLoanIntoCompanyStatus
}
