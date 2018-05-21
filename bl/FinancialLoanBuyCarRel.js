/**
 * Created by zwl on 2018/5/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var financialLoanBuyCarRelDAO = require('../dao/FinancialLoanBuyCarRelDAO.js');
var financialLoanDAO = require('../dao/FinancialLoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialLoanBuyCarRel.js');

function createFinancialLoanBuyCarRel(req,res,next){
    var params = req.params ;
    var buyCarRelId = 0;
    Seq().seq(function(){
        var that = this;
        financialLoanBuyCarRelDAO.addFinancialLoanBuyCarRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "VIN已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createFinancialLoanBuyCarRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    buyCarRelId = result.insertId;
                    logger.info(' createFinancialLoanBuyCarRel ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create financialLoanBuyCarRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        financialLoanDAO.updateBuyCarCountPlus(params,function(error,result){
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
        logger.info(' createFinancialLoanBuyCarRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:buyCarRelId},null);
        return next();
    })
}

function queryFinancialLoanBuyCarRel(req,res,next){
    var params = req.params ;
    financialLoanBuyCarRelDAO.getFinancialLoanBuyCarRel(params,function(error,result){
        if (error) {
            logger.error(' queryFinancialLoanBuyCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryFinancialLoanBuyCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeFinancialLoanBuyCarRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        financialLoanBuyCarRelDAO.deleteFinancialLoanBuyCarRel(params,function(error,result){
            if (error) {
                logger.error(' removeFinancialLoanBuyCarRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeFinancialLoanBuyCarRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeFinancialLoanBuyCarRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        financialLoanDAO.updateBuyCarCountMinus(params,function(error,result){
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
    createFinancialLoanBuyCarRel : createFinancialLoanBuyCarRel,
    queryFinancialLoanBuyCarRel : queryFinancialLoanBuyCarRel,
    removeFinancialLoanBuyCarRel : removeFinancialLoanBuyCarRel
}
