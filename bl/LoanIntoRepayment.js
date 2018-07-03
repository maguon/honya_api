/**
 * Created by zwl on 2018/7/3.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var loanIntoRepaymentDAO = require('../dao/LoanIntoRepaymentDAO.js');
var loanIntoDAO = require('../dao/LoanIntoDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('LoanIntoRepayment.js');

function createLoanIntoRepayment(req,res,next){
    var params = req.params ;
    var repaymentId = 0;
    Seq().seq(function(){
        var that = this;
        loanIntoDAO.getLoanInto({loanIntoId:params.loanIntoId},function(error,rows){
            if (error) {
                logger.error(' getLoanInto ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].loan_into_status >= sysConst.LOAN_INTO_STATUS.loan_into){
                    that();
                }else{
                    logger.warn(' getLoanInto ' + 'failed');
                    resUtil.resetFailedRes(res," 还未放款，无法进行还款 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        loanIntoRepaymentDAO.addLoanIntoRepayment(params,function(error,result){
            if (error) {
                logger.error(' createLoanIntoRepayment ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createLoanIntoRepayment ' + 'success');
                    repaymentId = result.insertId;
                }else{
                    logger.warn(' createLoanIntoRepayment ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.loanIntoStatus=sysConst.LOAN_INTO_STATUS.repayment;
        loanIntoDAO.updateLoanIntoStatus(params,function(err,result){
            if (err) {
                logger.error(' updateLoanIntoStatus ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateLoanIntoStatus ' + 'success');
                }else{
                    logger.warn(' updateLoanIntoStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createLoanIntoRepayment ' + 'success');
        resUtil.resetCreateRes(res,{insertId:repaymentId},null);
        return next();
    })
}

function queryLoanIntoRepayment(req,res,next){
    var params = req.params ;
    loanIntoRepaymentDAO.getLoanIntoRepayment(params,function(error,result){
        if (error) {
            logger.error(' queryLoanIntoRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanIntoRepayment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateLoanIntoRepayment(req,res,next){
    var params = req.params;
    loanIntoRepaymentDAO.updateLoanIntoRepayment(params,function(error,result){
        if (error) {
            logger.error(' updateLoanIntoRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanIntoRepayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateLoanIntoRepaymentStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.repaymentEndDate = myDate;
    loanIntoRepaymentDAO.updateLoanIntoRepaymentStatus(params,function(error,result){
        if (error) {
            logger.error(' updateLoanIntoRepaymentStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanIntoRepaymentStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createLoanIntoRepayment : createLoanIntoRepayment,
    queryLoanIntoRepayment : queryLoanIntoRepayment,
    updateLoanIntoRepayment : updateLoanIntoRepayment,
    updateLoanIntoRepaymentStatus : updateLoanIntoRepaymentStatus
}