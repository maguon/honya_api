/**
 * Created by zwl on 2018/4/20.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var shipTransCarRelDAO = require('../dao/ShipTransCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransCarRel.js');

function createShipTransCarRel(req,res,next){
    var params = req.params ;
    shipTransCarRelDAO.addShipTransCarRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "VIN已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createShipTransCarRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createShipTransCarRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryShipTransCarRel(req,res,next){
    var params = req.params ;
    shipTransCarRelDAO.getShipTransCarRel(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeShipTransCarRel(req,res,next){
    var params = req.params;
    shipTransCarRelDAO.deleteShipTransCarRel(params,function(error,result){
        if (error) {
            logger.error(' removeShipTransCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeShipTransCarRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createShipTransCarRel : createShipTransCarRel,
    queryShipTransCarRel : queryShipTransCarRel,
    removeShipTransCarRel : removeShipTransCarRel
}

