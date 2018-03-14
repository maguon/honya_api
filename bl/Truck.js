/**
 * Created by zwl on 2017/3/14.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Truck.js');

function createTruck(req,res,next){
    var params = req.params;
    truckDAO.addTruck(params,function(error,result){
        if (error) {
            logger.error(' createTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createTruck ' + 'success');

            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryTruck(req,res,next){
    var params = req.params ;
    truckDAO.getTruck(params,function(error,result){
        if (error) {
            logger.error(' queryTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruck ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryFirstCount(req,res,next){
    var params = req.params ;
    truckDAO.getFirstCount(params,function(error,result){
        if (error) {
            logger.error(' queryFirstCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryFirstCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTrailerCount(req,res,next){
    var params = req.params ;
    truckDAO.getTrailerCount(params,function(error,result){
        if (error) {
            logger.error(' queryTrailerCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTrailerCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruck(req,res,next){
    var params = req.params ;
    truckDAO.updateTruck(params,function(error,result){
        if (error) {
            logger.error(' updateTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckDriveRel(req,res,next){
    var params = req.params ;
    truckDAO.updateTruckDriveRel(params,function(error,result){
        if (error) {
            logger.error(' updateTruckDriveRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckDriveRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckStatus (req,res,next){
    var params = req.params;
    truckDAO.updateTruckStatus(params,function(error,result){
        if (error) {
            logger.error(' updateTruckStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruck : createTruck,
    queryTruck : queryTruck,
    queryFirstCount : queryFirstCount,
    queryTrailerCount : queryTrailerCount,
    updateTruck : updateTruck,
    updateTruckDriveRel : updateTruckDriveRel,
    updateTruckStatus : updateTruckStatus
}