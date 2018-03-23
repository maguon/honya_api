/**
 * Created by zwl on 2017/4/14.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageParkingDAO = require('../dao/StorageParkingDAO.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageParking.js');

function queryStorageParking(req,res,next){
    var params = req.params ;
    storageParkingDAO.getStorageParking(params,function(error,result){
        if (error) {
            logger.error(' queryStorageParking ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageParking ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateStorageParking(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        carDAO.getCarBase(params,function(error,rows){
            if (error) {
                logger.error(' getCarBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1){
                    parkObj.parkingId = rows[0].p_id;
                    parkObj.storageId = rows[0].storage_id;
                    parkObj.storageName = rows[0].storage_name;
                    parkObj.relId = rows[0].r_id;
                    parkObj.carId = rows[0].id;
                    parkObj.vin = rows[0].vin;
                    that();
                }else{
                    logger.warn(' getCarBase ' + 'failed');
                    resUtil.resetFailedRes(res,"car is not empty");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        storageParkingDAO.getStorageParking(params,function(error,rows){
            if (error) {
                logger.error(' getStorageParking ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].car_id == 0){
                    parkObj.row = rows[0].row;
                    parkObj.col = rows[0].col;
                    that();
                }else{
                    logger.warn(' getStorageParking ' + 'failed');
                    resUtil.resetFailedRes(res,"parking is not empty");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        var subParams ={
            parkingId:parkObj.parkingId,
            storageId:parkObj.storageId
        }
        storageParkingDAO.updateStorageParkingMove(subParams,function(error,result){
            if (error) {
                logger.error(' updateStorageParkingMove ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageParkingMove ' + 'success');
                }else{
                    logger.warn(' updateStorageParkingMove ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var subParams ={
            parkingId:params.parkingId,
            carId:params.carId,
            relId:parkObj.relId

        }
        storageParkingDAO.updateStorageParking(subParams,function(error,result){
            if (error) {
                logger.error(' updateStorageParking ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateStorageParking ' + 'success');
                req.params.carContent =" moving storage "+parkObj.storageName + " parking at row " +parkObj.row+ " column "+parkObj.col;
                req.params.vin =parkObj.vin;
                req.params.op =12;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryStorageParkingMakeStat(req,res,next){
    var params = req.params ;
    storageParkingDAO.getStorageMakeStat(params,function(error,result){
        if (error) {
            logger.error(' queryStorageParkingMakeStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageParkingMakeStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryStorageParking : queryStorageParking,
    updateStorageParking : updateStorageParking,
    queryStorageParkingMakeStat : queryStorageParkingMakeStat
}