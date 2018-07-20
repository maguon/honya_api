/**
 * Created by zwl on 2018/7/20.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var shipTransOrderFeeRelDAO = require('../dao/ShipTransOrderFeeRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrderFeeRel.js');

function createShipTransOrderFeeRel(req,res,next){
    var params = req.params ;
    shipTransOrderFeeRelDAO.addShipTransOrderFeeRel(params,function(error,result){
        if (error) {
            logger.error(' createShipTransOrderFeeRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createShipTransOrderFeeRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryShipTransOrderFeeRel(req,res,next){
    var params = req.params ;
    shipTransOrderFeeRelDAO.getShipTransOrderFeeRel(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransOrderFeeRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransOrderFeeRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createShipTransOrderFeeRel : createShipTransOrderFeeRel,
    queryShipTransOrderFeeRel : queryShipTransOrderFeeRel
}
