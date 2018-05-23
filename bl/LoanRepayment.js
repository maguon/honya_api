/**
 * Created by zwl on 2018/5/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var loanRepaymentDAO = require('../dao/LoanRepaymentDAO.js');
var loanDAO = require('../dao/LoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanRepayment.js');

function createLoanRepayment(req,res,next){
    var params = req.params ;
    var repaymentId = 0;
    Seq().seq(function(){
        var that = this;
        loanRepaymentDAO.addLoanRepayment(params,function(error,result){
            if (error) {
                logger.error(' createLoanRepayment ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createLoanRepayment ' + 'success');
                    repaymentId = result.insertId;
                }else{
                    logger.warn(' createLoanRepayment ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.loanStatus=sysConst.LOAN_STATUS.repayment;
        loanDAO.updateLoanStatus(params,function(err,result){
            if (err) {
                logger.error(' updateLoanStatus ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateLoanStatus ' + 'success');
                }else{
                    logger.warn(' updateLoanStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createLoanRepayment ' + 'success');
        resUtil.resetCreateRes(res,{insertId:repaymentId},null);
        return next();
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

function updateLoanRepaymentStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.repaymentEndDate = myDate;
    loanRepaymentDAO.updateLoanRepaymentStatus(params,function(error,result){
        if (error) {
            logger.error(' updateLoanRepaymentStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanRepaymentStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createLoanRepayment : createLoanRepayment,
    queryLoanRepayment : queryLoanRepayment,
    updateLoanRepaymentStatus : updateLoanRepaymentStatus
}