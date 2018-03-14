/**
 * Created by zwl on 2017/4/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var brandDAO = require('../dao/BrandDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Brand.js');

function createBrand(req,res,next){
    var params = req.params ;
    brandDAO.addBrand(params,function(error,result){
        if (error) {
            logger.error(' createBrand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createBrand ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryBrand(req,res,next){
    var params = req.params ;
    brandDAO.getBrand(params,function(error,result){
        if (error) {
            logger.error(' queryBrand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryBrand ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateBrand(req,res,next){
    var params = req.params ;
    brandDAO.updateBrand(params,function(error,result){
        if (error) {
            logger.error(' updateBrand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateBrand ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createBrand : createBrand,
    queryBrand : queryBrand,
    updateBrand : updateBrand
}
