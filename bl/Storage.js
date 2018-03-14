/**
 * Created by zwl on 2017/4/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageDAO = require('../dao/StorageDAO.js');
var storageParkingDAO = require('../dao/StorageParkingDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Storage.js');

function createStorage(req,res,next){
    var params = req.params ;
    var storageId = 0;
    Seq().seq(function(){
        var that = this;
        storageDAO.addStorage(params,function(error,result){
            if (error) {
                logger.error(' createStorage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createStorage ' + 'success');
                    storageId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create storage failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var rowArray = [] ,colArray=[];
        rowArray.length= params.row;
        colArray.length= params.col;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            Seq(colArray).seqEach(function(colObj,j){
                var that = this;
                var subParams ={
                    storageId : storageId,
                    row : i+1,
                    col : j+1,
                }
                storageParkingDAO.addStorageParking(subParams,function(err,result){
                    if (err) {
                        logger.error(' createStorage ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if(result&&result.insertId>0){
                            logger.info(' createStorage parking ' + 'success');
                        }else{
                            logger.warn(' createStorage parking ' + 'failed');
                        }
                        that(null,j);
                    }
                })
            }).seq(function(){
                that(null,i);
            })
        }).seq(function(){
            that();
        })

    }).seq(function(){
        logger.info(' createStorage ' + 'success');
        resUtil.resetCreateRes(res,{insertId:storageId},null);
        return next();
    })

}

function queryStorage(req,res,next){
    var params = req.params ;
    storageDAO.getStorage(params,function(error,result){
        if (error) {
            logger.error(' queryStorage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryStorageDate(req,res,next){
    var params = req.params ;
    storageDAO.getStorageDate(params,function(error,result){
        if (error) {
            logger.error(' queryStorageDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryStorageCount(req,res,next){
    var params = req.params ;
    storageDAO.getStorageCount(params,function(error,result){
        if (error) {
            logger.error(' queryStorageCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryStorageTotalMonth(req,res,next){
    var params = req.params ;
    storageDAO.getStorageTotalMonth(params,function(error,result){
        if (error) {
            logger.error(' queryStorageTotalMonth ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageTotalMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryStorageTotalDay(req,res,next){
    var params = req.params ;
    storageDAO.getStorageTotalDay(params,function(error,result){
        if (error) {
            logger.error(' queryStorageTotalDay ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageTotalDay ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateStorage(req,res,next){
    var params = req.params ;
    storageDAO.updateStorage(params,function(error,result){
        if (error) {
            logger.error(' updateStorage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorage ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateStorageStatus (req,res,next){
    var params = req.params;
     var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
    var day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
    var dateStr = year + month + day;
    Seq().seq(function(){
        var that = this;
        var subParams ={
            storageId : params.storageId,
            dateStart : dateStr,
            dateEnd : dateStr
        }
        storageDAO.getStorageDate(subParams,function(error,rows){
            if (error) {
                logger.error(' getStorageDate ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0 &&rows[0].balance == 0){
                    that();
                }else{
                    logger.warn(' getStorageDate ' + 'failed');
                    resUtil.resetFailedRes(res,"StorageParking is not empty");
                    return next();
                }
            }
        })
    }).seq(function () {
        storageDAO.updateStorageStatus(params,function(error,result){
            if (error) {
                logger.error(' updateStorageStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateStorageStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createStorage : createStorage,
    queryStorage : queryStorage,
    queryStorageDate : queryStorageDate,
    queryStorageCount : queryStorageCount,
    queryStorageTotalMonth : queryStorageTotalMonth,
    queryStorageTotalDay : queryStorageTotalDay,
    updateStorage : updateStorage,
    updateStorageStatus : updateStorageStatus
}