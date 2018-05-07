/**
 * Created by zwl on 2018/3/30.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carKeyPositionDAO = require('../dao/CarKeyPositionDAO.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarKeyPosition.js');

function queryCarKeyPosition(req,res,next){
    var params = req.params ;
    carKeyPositionDAO.getCarKeyPosition(params,function(error,result){
        if (error) {
            logger.error(' queryCarKeyPosition ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarKeyPosition ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarKeyPositionCount(req,res,next){
    var params = req.params ;
    carKeyPositionDAO.getCarKeyPositionCount(params,function(error,result){
        if (error) {
            logger.error(' queryCarKeyPositionCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarKeyPositionCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarKeyPosition(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        carDAO.getCarList(params,function(error,rows){
            if (error) {
                logger.error(' getCarList ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1){
                    parkObj.vin = rows[0].vin;
                    that();
                }else{
                    logger.warn(' getCarList ' + 'failed');
                    resUtil.resetFailedRes(res,"car is not empty");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        carKeyPositionDAO.getCarKeyPosition({carKeyPositionId:params.carKeyPositionId},function(error,rows){
            if (error) {
                logger.error(' getCarKeyPosition ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].car_id == 0){
                    parkObj.keyCabinetName = rows[0].key_cabinet_name;
                    parkObj.areaName = rows[0].area_name;
                    parkObj.row = rows[0].row;
                    parkObj.col = rows[0].col;
                    that();
                }else{
                    logger.warn(' getCarKeyPosition ' + 'failed');
                    resUtil.resetFailedRes(res,"carKeyPosition is not empty");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        carKeyPositionDAO.updateCarKeyPositionMove(params,function(error,result){
            if (error) {
                logger.error(' updateCarKeyPosition ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCarKeyPosition ' + 'success');
                }else{
                    logger.warn(' updateCarKeyPosition ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        carKeyPositionDAO.updateCarKeyPosition(params,function(error,result){
            if (error) {
                logger.error(' updateCarKeyPosition ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarKeyPosition ' + 'success');
                req.params.carContent =" carKeyCabinet "+parkObj.keyCabinetName+ " area " + parkObj.areaName + " position at row " +parkObj.row+ " column "+parkObj.col;
                req.params.op =21;
                req.params.vin =parkObj.vin;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    queryCarKeyPosition : queryCarKeyPosition,
    queryCarKeyPositionCount : queryCarKeyPositionCount,
    updateCarKeyPosition : updateCarKeyPosition
}