/**
 * Created by zwl on 2017/4/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var cityDAO = require('../dao/CityDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('City.js');

function createCity(req,res,next){
    var params = req.params ;
    cityDAO.addCity(params,function(error,result){
        if (error) {
            logger.error(' createCity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCity ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCity(req,res,next){
    var params = req.params ;
    cityDAO.getCity(params,function(error,result){
        if (error) {
            logger.error(' queryCity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCity ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCity(req,res,next){
    var params = req.params ;
    cityDAO.updateCity(params,function(error,result){
        if (error) {
            logger.error(' updateCity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCity : createCity,
    queryCity : queryCity,
    updateCity : updateCity
}