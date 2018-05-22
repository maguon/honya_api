/**
 * Created by zwl on 2018/5/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var creditDAO = require('../dao/CreditDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Credit.js');

function createCredit(req,res,next){
    var params = req.params ;
    creditDAO.addCredit(params,function(error,result){
        if (error) {
            logger.error(' createCredit ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCredit ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCredit(req,res,next){
    var params = req.params ;
    creditDAO.getCredit(params,function(error,result){
        if (error) {
            logger.error(' queryCredit ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCredit ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCredit(req,res,next){
    var params = req.params ;
    creditDAO.updateCredit(params,function(error,result){
        if (error) {
            logger.error(' updateCredit ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCredit ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCreditStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.creditEndDate = myDate;
    creditDAO.updateCreditStatus(params,function(error,result){
        if (error) {
            logger.error(' updateCreditStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCreditStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCredit : createCredit,
    queryCredit : queryCredit,
    updateCredit : updateCredit,
    updateCreditStatus : updateCreditStatus
}
