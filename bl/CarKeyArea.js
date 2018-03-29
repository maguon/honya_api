/**
 * Created by zwl on 2018/3/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carKeyAreaDAO = require('../dao/CarKeyAreaDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyArea.js');

function createCarKeyArea(req,res,next){
    var params = req.params ;
    carKeyAreaDAO.addCarKeyArea(params,function(error,result){
        if (error) {
            logger.error(' createCarKeyArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCarKeyArea ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCarKeyArea(req,res,next){
    var params = req.params ;
    carKeyAreaDAO.getCarKeyArea(params,function(error,result){
        if (error) {
            logger.error(' queryCarKeyArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarKeyArea ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarKeyArea(req,res,next){
    var params = req.params ;
    carKeyAreaDAO.updateCarKeyArea(params,function(error,result){
        if (error) {
            logger.error(' updateCarKeyArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarKeyArea ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarKeyArea : createCarKeyArea,
    queryCarKeyArea : queryCarKeyArea,
    updateCarKeyArea : updateCarKeyArea
}
