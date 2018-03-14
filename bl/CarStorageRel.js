/**
 * Created by zwl on 2017/4/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carStorageRelDAO = require('../dao/CarStorageRelDAO.js');
var carDAO = require('../dao/CarDAO.js');
var storageParkingDAO = require('../dao/StorageParkingDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarStorageRel.js');

function createCarStorageRel(req,res,next){
    var params = req.params ;
    var parkObj = {};
    var carId = 0;
    var relId = 0;
    var newCarFlag  = true;
    var myDate = new Date();
    Seq().seq(function(){
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
    }).seq(function(){
        var that = this;
        carDAO.getCarBase({vin:params.vin},function(error,rows){
            if (error) {
                logger.error(' getCarBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getCarBase ' +params.vin+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        if(newCarFlag){
            carDAO.addCar(params,function(error,result){
                if (error) {
                    logger.error(' createCar ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createCar ' + 'success');
                        carId = result.insertId;
                        req.params.carId = carId;
                        that();
                    }else{
                        resUtil.resetFailedRes(res,"create car failed");
                        return next();
                    }
                }
            })
        }else{
            that();
        }
    }).seq(function(){
        var that = this;
        if(params.enterTime == null){
            params.enterTime = myDate;
        }
        var subParams ={
            carId : carId,
            storageId : params.storageId,
            storageName : params.storageName,
            enterTime : params.enterTime,
            planOutTime : params.planOutTime,
        }
        carStorageRelDAO.addCarStorageRel(subParams,function(err,result){
            if (err) {
                logger.error(' createCarStorageRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createCarStorageRel ' + 'success');
                    relId = result.insertId;
                }else{
                    logger.warn(' createCarStorageRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        var subParams ={
            carId : carId,
            relId : relId,
            parkingId : params.parkingId,
        }
        storageParkingDAO.updateStorageParking(subParams,function(err,result){
            if (err) {
                logger.error(' updateStorageParking ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageParking ' + 'success');
                }else{
                    logger.warn(' updateStorageParking ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createCarStorageRel ' + 'success');
        req.params.carContent =" Import storage "+req.params.storageName + " parking at row " +parkObj.row+ " column "+parkObj.col;
        req.params.op =11;
        resUtil.resetCreateRes(res,{insertId:carId},null);
        return next();
    })
}

function createAgainCarStorageRel(req,res,next){
    var params = req.params ;
    var parkObj = {};
    var carId = 0;
    var relId = 0;
    var newCarFlag  = true;
    var myDate = new Date();
    Seq().seq(function(){
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
    }).seq(function(){
        var that = this;
        var subParams ={
            carId : params.carId,
            vin : params.vin
        }
        carDAO.getCarBase(subParams,function(error,rows){
            if (error) {
                logger.error(' getCarBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].rel_status == listOfValue.REL_STATUS_MOVE){
                    logger.warn(' getCarBase ' +params.vin+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING);
                    return next();
                }else if(rows && rows.length>0&&rows[0].rel_status == listOfValue.REL_STATUS_OUT) {
                    carId = rows[0].id;
                    newCarFlag = false;
                    that();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        if(newCarFlag){
            carDAO.addCar(params,function(error,result){
                if (error) {
                    logger.error(' createCar ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createCar ' + 'success');
                        carId = result.insertId;
                        req.params.carId = carId;
                        that();
                    }else{
                        resUtil.resetFailedRes(res,"create car failed");
                        return next();
                    }
                }
            })
        }else{
            that();
        }
    }).seq(function(){
        var that = this;
        if(params.enterTime == null){
            params.enterTime = myDate;
        }
        var subParams ={
            carId : carId,
            storageId : params.storageId,
            storageName : params.storageName,
            enterTime : params.enterTime,
            planOutTime : params.planOutTime,
        }
        carStorageRelDAO.addCarStorageRel(subParams,function(err,result){
            if (err) {
                logger.error(' createCarStorageRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createCarStorageRel ' + 'success');
                    relId = result.insertId;
                }else{
                    logger.warn(' createCarStorageRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        var subParams ={
            carId : carId,
            relId : relId,
        }
        carStorageRelDAO.updateRelActive(subParams,function(err,result){
            if (err) {
                logger.error(' updateRelActive ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateRelActive ' + 'success');
                }else{
                    logger.warn(' updateRelActive ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        var subParams ={
            carId : carId,
            relId : relId,
            parkingId : params.parkingId,
        }
        storageParkingDAO.updateStorageParking(subParams,function(err,result){
            if (err) {
                logger.error(' updateStorageParking ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageParking ' + 'success');
                }else{
                    logger.warn(' updateStorageParking ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createAgainCarStorageRel ' + 'success');
        req.params.carContent =" Import storage "+req.params.storageName + " parking at row " +parkObj.row+ " column "+parkObj.col;
        req.params.op =11;
        resUtil.resetCreateRes(res,{insertId:carId},null);
        return next();
    })
}

function updateRelStatus(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        carDAO.getCarBase({carId:params.carId},function(error,rows){
            if (error) {
                logger.error(' getCarBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].rel_status == listOfValue.REL_STATUS_MOVE){
                    parkObj.parkingId = rows[0].p_id;
                    parkObj.storageId = rows[0].storage_id;
                    parkObj.storageName = rows[0].storage_name;
                    parkObj.row = rows[0].row;
                    parkObj.col = rows[0].col;
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
        carStorageRelDAO.updateRelStatus(params,function(error,result){
            if (error) {
                logger.error(' updateRelStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateRelStatus ' + 'success');
                }else{
                    logger.warn(' updateRelStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        carStorageRelDAO.getCarStorageRel(params,function(error,rows){
            if (error) {
                logger.error(' getCarStorageRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].rel_status == listOfValue.REL_STATUS_OUT){
                    that();
                }else{
                    logger.warn(' getCarStorageRel ' + 'failed');
                    resUtil.resetFailedRes(res,"carStorageRel is not empty");
                    return next();
                }
            }
        })
    }).seq(function () {
        var subParams ={
            parkingId:parkObj.parkingId,
            storageId:parkObj.storageId,
            carId:parkObj.carId
        }
        storageParkingDAO.updateStorageParkingOut(subParams,function(error,result){
            if (error) {
                logger.error(' updateStorageParkingOut ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateStorageParkingOut ' + 'success');
                req.params.carContent =" export storage "+parkObj.storageName + " parking at row " +parkObj.row+ " column "+parkObj.col;
                req.params.vin =parkObj.vin;
                req.params.op =13;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateRelPlanOutTime(req,res,next){
    var params = req.params ;
    carStorageRelDAO.updateRelPlanOutTime(params,function(error,result){
        if (error) {
            logger.error(' updateRelPlanOutTime ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateRelPlanOutTime ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarStorageRel : createCarStorageRel,
    createAgainCarStorageRel : createAgainCarStorageRel,
    updateRelStatus : updateRelStatus,
    updateRelPlanOutTime : updateRelPlanOutTime
}
