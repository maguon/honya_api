/**
 * Created by zwl on 2017/4/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carMakeDAO = require('../dao/CarMakeDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarMake.js');

function createCarMake(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        carMakeDAO.getCarMake({makeName:params.makeName},function(error,rows){
            if (error) {
                logger.error(' getCarMake ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getCarMake ' +params.makeName+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING) ;
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        carMakeDAO.addCarMake(params,function(error,result){
            if (error) {
                logger.error(' createCarMake ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createCarMake ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryCarMake(req,res,next){
    var params = req.params ;
    carMakeDAO.getCarMake(params,function(error,result){
        if (error) {
            logger.error(' queryCarMake ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarMake ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarMake(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        carMakeDAO.getCarMake({makeName:params.makeName},function(error,rows){
            if (error) {
                logger.error(' getCarMake ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getCarMake ' +params.makeName+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING) ;
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        carMakeDAO.updateCarMake(params,function(error,result){
            if (error) {
                logger.error(' updateCarMake ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarMake ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createCarMake : createCarMake,
    queryCarMake : queryCarMake,
    updateCarMake : updateCarMake
}