/**
 * Created by zwl on 2018/7/2.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var loanIntoDAO = require('../dao/LoanIntoDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('LoanInto.js');

function createLoanInto(req,res,next){
    var params = req.params ;
    loanIntoDAO.addLoanInto(params,function(error,result){
        if (error) {
            logger.error(' createLoanInto ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createLoanInto ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryLoanInto(req,res,next){
    var params = req.params ;
    loanIntoDAO.getLoanInto(params,function(error,result){
        if (error) {
            logger.error(' queryLoanInto ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanInto ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryLoanIntoNotCount(req,res,next){
    var params = req.params ;
    loanIntoDAO.getLoanIntoNotCount(params,function(error,result){
        if (error) {
            logger.error(' queryLoanIntoNotCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanIntoNotCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryLoanIntoStatDate(req,res,next){
    var params = req.params ;
    loanIntoDAO.getLoanIntoStatDate(params,function(error,result){
        if (error) {
            logger.error(' queryLoanIntoStatDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanIntoStatDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateLoanInto(req,res,next){
    var params = req.params ;
    loanIntoDAO.updateLoanInto(params,function(error,result){
        if (error) {
            logger.error(' updateLoanInto ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanInto ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateLoanIntoStatus(req,res,next){
    var params = req.params;
    var loanIntoMoney = 0;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    Seq().seq(function(){
        var that = this;
        loanIntoDAO.getLoanInto({loanIntoId:params.loanIntoId},function(error,rows){
            if (error) {
                logger.error(' getLoanInto ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0&&rows[0].loan_into_status == sysConst.LOAN_INTO_STATUS.not_loan_into){
                    loanIntoMoney = rows[0].loan_into_money;
                    that();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        if(params.loanIntoStatus==sysConst.LOAN_INTO_STATUS.loan_into){
            params.notRepaymentMoney = loanIntoMoney;
            params.startDateId = parseInt(strDate);
            params.loanIntoStartDate = myDate;
        }
        if(params.loanIntoStatus==sysConst.LOAN_INTO_STATUS.completed){
            params.endDateId = parseInt(strDate);
            params.loanIntoEndDate = myDate;
        }
        loanIntoDAO.updateLoanIntoStatus(params,function(error,result){
            if (error) {
                logger.error(' updateLoanIntoStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateLoanIntoStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createLoanInto : createLoanInto,
    queryLoanInto : queryLoanInto,
    queryLoanIntoNotCount : queryLoanIntoNotCount,
    queryLoanIntoStatDate : queryLoanIntoStatDate,
    updateLoanInto : updateLoanInto,
    updateLoanIntoStatus : updateLoanIntoStatus
}