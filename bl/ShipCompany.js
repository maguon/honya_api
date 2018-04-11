/**
 * Created by zwl on 2018/4/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var shipCompanyDAO = require('../dao/ShipCompanyDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipCompany.js');

function createShipCompany(req,res,next){
    var params = req.params ;
    shipCompanyDAO.addShipCompany(params,function(error,result){
        if (error) {
            logger.error(' createShipCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createShipCompany ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryShipCompany(req,res,next){
    var params = req.params ;
    shipCompanyDAO.getShipCompany(params,function(error,result){
        if (error) {
            logger.error(' queryShipCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipCompany ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateShipCompany(req,res,next){
    var params = req.params ;
    shipCompanyDAO.updateShipCompany(params,function(error,result){
        if (error) {
            logger.error(' updateShipCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateShipCompany ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createShipCompany : createShipCompany,
    queryShipCompany : queryShipCompany,
    updateShipCompany : updateShipCompany
}
