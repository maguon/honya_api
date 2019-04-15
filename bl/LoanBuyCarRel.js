/**
 * Created by zwl on 2018/5/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var loanBuyCarRelDAO = require('../dao/LoanBuyCarRelDAO.js');
var loanDAO = require('../dao/LoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanBuyCarRel.js');

function createLoanBuyCarRel(req,res,next){
    var params = req.params ;
    var buyCarRelId = 0;
    Seq().seq(function(){
        var that = this;
        loanBuyCarRelDAO.addLoanBuyCarRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "VIN已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createLoanBuyCarRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    buyCarRelId = result.insertId;
                    logger.info(' createLoanBuyCarRel ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create LoanBuyCarRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        loanDAO.updateBuyCarCountPlus(params,function(error,result){
            if (error) {
                logger.error(' updateBuyCarCountPlus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateBuyCarCountPlus ' + 'success');
                }else{
                    logger.warn(' updateBuyCarCountPlus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createLoanBuyCarRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:buyCarRelId},null);
        return next();
    })
}

function queryLoanBuyCarRel(req,res,next){
    var params = req.params ;
    loanBuyCarRelDAO.getLoanBuyCarRel(params,function(error,result){
        if (error) {
            logger.error(' queryLoanBuyCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanBuyCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateLoanBuyCarRel(req,res,next){
    var params = req.params ;
    loanBuyCarRelDAO.updateLoanBuyCarRel(params,function(error,result){
        if (error) {
            logger.error(' updateLoanBuyCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateLoanBuyCarRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeLoanBuyCarRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        loanBuyCarRelDAO.deleteLoanBuyCarRel(params,function(error,result){
            if (error) {
                logger.error(' removeLoanBuyCarRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeLoanBuyCarRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeLoanBuyCarRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        loanDAO.updateBuyCarCountMinus(params,function(error,result){
            if (error) {
                logger.error(' updateBuyCarCountMinus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateBuyCarCountMinus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createLoanBuyCarRel : createLoanBuyCarRel,
    queryLoanBuyCarRel : queryLoanBuyCarRel,
    updateLoanBuyCarRel : updateLoanBuyCarRel,
    removeLoanBuyCarRel : removeLoanBuyCarRel
}
