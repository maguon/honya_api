/**
 * Created by zwl on 2018/7/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var invoiceShipOrderRelDAO = require('../dao/InvoiceShipOrderRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('InvoiceShipOrderRel.js');

function createInvoiceShipOrderRel(req,res,next){
    var params = req.params ;
    invoiceShipOrderRelDAO.addInvoiceShipOrderRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "订单编号已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createInvoiceShipOrderRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createInvoiceShipOrderRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createInvoiceShipOrderRel : createInvoiceShipOrderRel
}
