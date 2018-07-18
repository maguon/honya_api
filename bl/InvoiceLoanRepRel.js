/**
 * Created by zwl on 2018/7/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var invoiceLoanRepRelDAO = require('../dao/InvoiceLoanRepRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceLoanRepRel.js');

function createInvoiceLoanRepRel(req,res,next){
    var params = req.params ;
    invoiceLoanRepRelDAO.addInvoiceLoanRepRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "还款编号已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createInvoiceLoanRepRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createInvoiceLoanRepRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createInvoiceLoanRepRel : createInvoiceLoanRepRel
}
