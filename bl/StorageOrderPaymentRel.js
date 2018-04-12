/**
 * Created by zwl on 2018/4/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageOrderPaymentRelDAO = require('../dao/StorageOrderPaymentRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageOrderPaymentRel.js');

function queryStorageOrderPaymentRel(req,res,next){
    var params = req.params ;
    storageOrderPaymentRelDAO.getStorageOrderPaymentRel(params,function(error,result){
        if (error) {
            logger.error(' queryStorageOrderPaymentRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageOrderPaymentRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryStorageOrderPaymentRel : queryStorageOrderPaymentRel
}