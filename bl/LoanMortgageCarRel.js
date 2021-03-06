/**
 * Created by zwl on 2018/5/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var loanMortgageCarRelDAO = require('../dao/LoanMortgageCarRelDAO.js');
var loanDAO = require('../dao/LoanDAO.js');
var carStorageRelDAO = require('../dao/CarStorageRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanMortgageCarRel.js');

function createLoanMortgageCarRel(req,res,next){
    var params = req.params ;
    var mortgageCarRelId = 0;
    Seq().seq(function(){
        var that = this;
        loanMortgageCarRelDAO.addLoanMortgageCarRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "VIN已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createLoanMortgageCarRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    mortgageCarRelId = result.insertId;
                    logger.info(' createLoanMortgageCarRel ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create LoanMortgageCarRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        loanDAO.updateMortgageCarCountPlus(params,function(error,result){
            if (error) {
                logger.error(' updateMortgageCarCountPlus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateMortgageCarCountPlus ' + 'success');
                }else{
                    logger.warn(' updateMortgageCarCountPlus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.mortgageStatus = sysConst.MORTGAGE_STATUS.mortgage;
        carStorageRelDAO.updateMortgageStatus(params,function(error,result){
            if (error) {
                logger.error(' updateMortgageStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateMortgageStatus ' + 'success');
                }else{
                    logger.warn(' updateMortgageStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createLoanMortgageCarRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:mortgageCarRelId},null);
        return next();
    })
}

function queryLoanMortgageCarRel(req,res,next){
    var params = req.params ;
    loanMortgageCarRelDAO.getLoanMortgageCarRel(params,function(error,result){
        if (error) {
            logger.error(' queryLoanMortgageCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanMortgageCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeLoanMortgageCarRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        loanMortgageCarRelDAO.deleteLoanMortgageCarRel(params,function(error,result){
            if (error) {
                logger.error(' removeLoanMortgageCarRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeLoanMortgageCarRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeLoanMortgageCarRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.mortgageStatus = sysConst.MORTGAGE_STATUS.not_mortgage;
        carStorageRelDAO.updateMortgageStatus(params,function(error,result){
            if (error) {
                logger.error(' updateMortgageStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateMortgageStatus ' + 'success');
                }else{
                    logger.warn(' updateMortgageStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        loanDAO.updateMortgageCarCountMinus(params,function(error,result){
            if (error) {
                logger.error(' updateMortgageCarCountMinus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateMortgageCarCountMinus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createLoanMortgageCarRel : createLoanMortgageCarRel,
    queryLoanMortgageCarRel : queryLoanMortgageCarRel,
    removeLoanMortgageCarRel : removeLoanMortgageCarRel
}