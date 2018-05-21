/**
 * Created by zwl on 2018/5/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var financialCreditCarRelDAO = require('../dao/FinancialCreditCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FinancialCreditCarRel.js');

function createFinancialCreditCarRel(req,res,next){
    var params = req.params ;
    financialCreditCarRelDAO.addFinancialCreditCarRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "VIN已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createFinancialCreditCarRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createFinancialCreditCarRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryFinancialCreditCarRel(req,res,next){
    var params = req.params ;
    financialCreditCarRelDAO.getFinancialCreditCarRel(params,function(error,result){
        if (error) {
            logger.error(' queryFinancialCreditCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryFinancialCreditCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeFinancialCreditCarRel(req,res,next){
    var params = req.params;
    financialCreditCarRelDAO.deleteFinancialCreditCarRel(params,function(error,result){
        if (error) {
            logger.error(' removeFinancialCreditCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeFinancialCreditCarRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createFinancialCreditCarRel : createFinancialCreditCarRel,
    queryFinancialCreditCarRel : queryFinancialCreditCarRel,
    removeFinancialCreditCarRel : removeFinancialCreditCarRel
}