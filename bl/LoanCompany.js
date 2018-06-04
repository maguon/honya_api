/**
 * Created by zwl on 2018/6/4.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var loanCompanyDAO = require('../dao/LoanCompanyDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoanCompany.js');

function createLoanCompany(req,res,next){
    var params = req.params ;
    loanCompanyDAO.addLoanCompany(params,function(error,result){
        if (error) {
            logger.error(' createLoanCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createLoanCompany ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createLoanCompany : createLoanCompany
}
