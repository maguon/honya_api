/**
 * Created by zwl on 2018/4/20.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var shipTransDAO = require('../dao/ShipTransDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTrans.js');

function createShipTrans(req,res,next){
    var params = req.params ;
    shipTransDAO.addShipTrans(params,function(error,result){
        if (error) {
            logger.error(' createShipTrans ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createShipTrans ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryShipTrans(req,res,next){
    var params = req.params ;
    shipTransDAO.getShipTrans(params,function(error,result){
        if (error) {
            logger.error(' queryShipTrans ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTrans ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateShipTrans(req,res,next){
    var params = req.params ;
    shipTransDAO.updateShipTrans(params,function(error,result){
        if (error) {
            logger.error(' updateShipTrans ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateShipTrans ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createShipTrans : createShipTrans,
    queryShipTrans : queryShipTrans,
    updateShipTrans : updateShipTrans
}