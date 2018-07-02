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
    params.notRepaymentMoney = params.loanIntoMoney;
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


module.exports = {
    createLoanInto : createLoanInto
}