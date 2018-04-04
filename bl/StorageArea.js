/**
 * Created by zwl on 2018/4/4.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageAreaDAO = require('../dao/StorageAreaDAO.js');
var storageParkingDAO = require('../dao/StorageParkingDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageArea.js');

function createStorageArea(req,res,next){
    var params = req.params ;
    var areaId = 0;
    Seq().seq(function(){
        var that = this;
        storageAreaDAO.addStorageArea(params,function(error,result){
            if (error) {
                logger.error(' createStorageArea ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createStorageArea ' + 'success');
                    areaId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create storageArea failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var rowArray = [] ,colArray=[] ,lotArray=[];
        rowArray.length= params.row;
        colArray.length= params.col;
        lotArray.length= params.lot;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            Seq(colArray).seqEach(function(colObj,j){
                var that = this;
                Seq(lotArray).seqEach(function(lotObj,t){
                    var that = this;
                var subParams ={
                    storageId : params.storageId,
                    areaId : areaId,
                    row : i+1,
                    col : j+1,
                    lot : t+1,
                }
                storageParkingDAO.addStorageParking(subParams,function(err,result){
                    if (err) {
                        logger.error(' createStorageParking ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if(result&&result.insertId>0){
                            logger.info(' createStorage parking ' + 'success');
                        }else{
                            logger.warn(' createStorage parking ' + 'failed');
                        }
                        that(null,t);
                    }
                })
            }).seq(function(){
                that(null,j);
            })
        }).seq(function(){
            that(null,i);
        })
    }).seq(function(){
        that();
    })

    }).seq(function(){
        logger.info(' createStorageArea ' + 'success');
        resUtil.resetCreateRes(res,{insertId:areaId},null);
        return next();
    })

}

function queryStorageArea(req,res,next){
    var params = req.params ;
    storageAreaDAO.getStorageArea(params,function(error,result){
        if (error) {
            logger.error(' queryStorageArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageArea ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateStorageArea(req,res,next){
    var params = req.params ;
    storageAreaDAO.updateStorageArea(params,function(error,result){
        if (error) {
            logger.error(' updateStorageArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorageArea ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateStorageAreaStatus(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        storageParkingDAO.getStorageParkingBase(params,function(error,rows){
            if (error) {
                logger.error(' storageParking ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    logger.warn(' storageParking ' + 'failed');
                    resUtil.resetFailedRes(res,"storageParking is not empty");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        storageAreaDAO.updateStorageAreaStatus(params,function(error,result){
            if (error) {
                logger.error(' updateStorageAreaStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateStorageAreaStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createStorageArea : createStorageArea,
    queryStorageArea : queryStorageArea,
    updateStorageArea : updateStorageArea,
    updateStorageAreaStatus : updateStorageAreaStatus
}