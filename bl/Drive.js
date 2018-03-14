/**
 * Created by zwl on 2017/3/15.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveDAO = require('../dao/DriveDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Drive.js');

function createDrive(req,res,next){
    var params = req.params;
    driveDAO.addDrive(params,function(error,result){
        if (error) {
            logger.error(' createDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDrive ' + 'success');

            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDrive(req,res,next){
    var params = req.params ;
    driveDAO.getDrive(params,function(error,result){
        if (error) {
            logger.error(' queryDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrive ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveCount(req,res,next){
    var params = req.params ;
    driveDAO.getDriveCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDrive(req,res,next){
    var params = req.params ;
    driveDAO.updateDrive(params,function(error,result){
        if (error) {
            logger.error(' updateDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDrive ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveStatus (req,res,next){
    var params = req.params;
    driveDAO.updateDriveStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDriveStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDrive : createDrive,
    queryDrive : queryDrive,
    queryDriveCount :queryDriveCount,
    updateDrive : updateDrive,
    updateDriveStatus : updateDriveStatus
}