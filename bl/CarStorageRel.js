/**
 * Created by zwl on 2017/4/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var carStorageRelDAO = require('../dao/CarStorageRelDAO.js');
var carDAO = require('../dao/CarDAO.js');
var storageParkingDAO = require('../dao/StorageParkingDAO.js');
var carKeyPositionDAO = require('../dao/CarKeyPositionDAO.js');
var storageOrderDAO = require('../dao/StorageOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
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
                    parkObj.lot = rows[0].lot;
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
        carDAO.getCarList({vin:params.vin},function(error,rows){
            if (error) {
                if(err.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else{
                    logger.error(' getCarList ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getCarList ' +params.vin+ sysMsg.CUST_CREATE_EXISTING);
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
            if(params.purchaseType==null){
                params.purchaseType = 0;
            }
            var myDate = new Date();
            var strDate = moment(myDate).format('YYYYMMDD');
            params.createdDateId = parseInt(strDate);
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
        var strDate = moment(myDate).format('YYYYMMDD');
        params.importDateId = parseInt(strDate);
        if(params.enterTime == null){
            params.enterTime = myDate;
        }
        var subParams ={
            carId : carId,
            storageId : params.storageId,
            storageName : params.storageName,
            enterTime : params.enterTime,
            planOutTime : params.planOutTime,
            importDateId : params.importDateId
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
        req.params.carContent =" Import storage "+req.params.storageName + " parking at row " +parkObj.row+ " column "+parkObj.col+ " lot "+parkObj.lot;
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
    var newCarFlag  = false;
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
                    parkObj.lot = rows[0].lot;
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
                    newCarFlag = true;
                    that();
                }else{
                    carId = rows[0].id;
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var strDate = moment(myDate).format('YYYYMMDD');
        params.importDateId = parseInt(strDate);
        if(params.enterTime == null){
            params.enterTime = myDate;
        }
        var subParams ={
            carId : carId,
            storageId : params.storageId,
            storageName : params.storageName,
            enterTime : params.enterTime,
            planOutTime : params.planOutTime,
            importDateId : params.importDateId,
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
        if(newCarFlag) {
            var subParams = {
                carId: carId,
                relId: relId,
            }
            carStorageRelDAO.updateRelActive(subParams, function (err, result) {
                if (err) {
                    logger.error(' updateRelActive ' + err.message);
                    throw sysError.InternalError(err.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateRelActive ' + 'success');
                    } else {
                        logger.warn(' updateRelActive ' + 'failed');
                    }
                    that();
                }
            })
        }else{
            that();
        }
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
        req.params.carContent =" Import storage "+req.params.storageName + " parking at row " +parkObj.row+ " column "+parkObj.col+ " lot "+parkObj.lot;
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
                    parkObj.lot = rows[0].lot;
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
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.exportDateId = parseInt(strDate);
        params.realOutTime = myDate;
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
                    parkObj.dayCount = rows[0].day_count;
                    parkObj.hourCount = rows[0].hour_count;
                    parkObj.planFee = rows[0].day_count*sysConst.FEE_MONEY.five;
                    parkObj.actualFee = rows[0].day_count*sysConst.FEE_MONEY.five;
                    that();
                }else{
                    logger.warn(' getCarStorageRel ' + 'failed');
                    resUtil.resetFailedRes(res,"carStorageRel is not empty");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var subParams ={
            relId : params.relId,
            carId : parkObj.carId,
            dayCount : parkObj.dayCount,
            hourCount : parkObj.hourCount,
            planFee : parkObj.planFee,
            actualFee : parkObj.actualFee,
            userId : params.userId
        }
        storageOrderDAO.addStorageOrder(subParams,function(error,result){
            if (error) {
                logger.error(' createStorageOrder ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createStorageOrder ' + 'success');
                }else{
                    logger.warn(' createStorageOrder ' + 'failed');
                }
                that();
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
                req.params.carContent =" export storage "+parkObj.storageName + " parking at row " +parkObj.row+ " column "+parkObj.col+ " lot "+parkObj.lot;
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

function queryCarStorageRel(req,res,next){
    var params = req.params ;
    carStorageRelDAO.getCarStorageRel(params,function(error,result){
        if (error) {
            logger.error(' queryCarStorageRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarStorageRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarStorageRel : createCarStorageRel,
    createAgainCarStorageRel : createAgainCarStorageRel,
    updateRelStatus : updateRelStatus,
    updateRelPlanOutTime : updateRelPlanOutTime,
    queryCarStorageRel : queryCarStorageRel
}
