/**
 * Created by zwl on 2018/7/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var loanIntoBuyCarRelDAO = require('../dao/LoanIntoBuyCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanIntoBuyCarRel.js');

function createLoanIntoBuyCarRel(req,res,next){
    var params = req.params ;
    loanIntoBuyCarRelDAO.addLoanIntoBuyCarRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "VIN已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createLoanIntoBuyCarRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createLoanIntoBuyCarRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryLoanIntoBuyCarRel(req,res,next){
    var params = req.params ;
    loanIntoBuyCarRelDAO.getLoanIntoBuyCarRel(params,function(error,result){
        if (error) {
            logger.error(' queryLoanIntoBuyCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLoanIntoBuyCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createLoanIntoBuyCarRel : createLoanIntoBuyCarRel,
    queryLoanIntoBuyCarRel : queryLoanIntoBuyCarRel
}