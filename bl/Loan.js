/**
 * Created by zwl on 2018/5/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var loanDAO = require('../dao/LoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('Loan.js');

function createLoan(req,res,next){
    var params = req.params ;
    loanDAO.addLoan(params,function(error,result){
        if (error) {
            logger.error(' createLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createLoan ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryLoan(req,res,next){
    var params = req.params ;
    loanDAO.getLoan(params,function(error,result){
        if (error) {
            logger.error(' queryLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoan ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateLoan(req,res,next){
    var params = req.params ;
    loanDAO.updateLoan(params,function(error,result){
        if (error) {
            logger.error(' updateLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoan ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateLoanStatus(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    if(params.loanStatus==sysConst.LOAN_STATUS.loan){
        params.startDateId = parseInt(strDate);
        params.loanStartDate = myDate;
    }
    if(params.loanStatus==sysConst.LOAN_STATUS.completed){
        params.endDateId = parseInt(strDate);
        params.loanEndDate = myDate;
    }
    loanDAO.updateLoanStatus(params,function(error,result){
        if (error) {
            logger.error(' updateLoanStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createLoan : createLoan,
    queryLoan : queryLoan,
    updateLoan : updateLoan,
    updateLoanStatus : updateLoanStatus
}