/**
 * Created by zwl on 2018/4/20.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var shipTransDAO = require('../dao/ShipTransDAO.js');
var shipTransOrderDAO = require('../dao/ShipTransOrderDAO.js');
var shipTransCarRelDAO = require('../dao/ShipTransCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTrans.js');

function createShipTrans(req,res,next){
    var params = req.params ;
    var shipTransId = 0;
    Seq().seq(function(){
        var that = this;
        if(params.carIds.length==0){
            logger.warn(' createShipTrans ' + 'failed');
            resUtil.resetFailedRes(res," 未关联VIN码，保存失败 ");
            return next();
        }
        params.shipTransCount = params.carIds.length;
        shipTransDAO.addShipTrans(params,function(error,result){
            if (error) {
                logger.error(' createShipTrans ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createShipTrans ' + 'success');
                    shipTransId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create shipTrans failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var carIds = params.carIds;
        var rowArray = [] ;
        rowArray.length= carIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                shipTransId : shipTransId,
                carId : carIds[i],
                row : i+1,
            }
            shipTransCarRelDAO.addShipTransCarRel(subParams,function(err,result){
                if (err) {
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "商品车已经被关联，操作失败");
                        return next();
                    } else{
                        logger.error(' createShipTransCarRel ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createShipTransCarRel ' + 'success');
                    }else{
                        logger.warn(' createShipTransCarRel ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        var that = this;
        var carIds = params.carIds;
        var shipTransFees = params.shipTransFees;
        var rowArray = [] ;
        rowArray.length= carIds.length;
        rowArray.length= shipTransFees.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                shipTransId : shipTransId,
                carId : carIds[i],
                shipTransFee : shipTransFees[i],
                row : i+1,
            }
            shipTransOrderDAO.addShipTransOrder(subParams,function(err,result){
                if (err) {
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "商品车已经存在，操作失败");
                        return next();
                    } else{
                        logger.error(' createShipTransCarRel ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createShipTransOrder ' + 'success');
                    }else{
                        logger.warn(' createShipTransOrder ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createShipTrans ' + 'success');
        resUtil.resetCreateRes(res,{insertId:shipTransId},null);
        return next();
    })
}

function queryShipTrans(req,res,next){
    var params = req.params ;
    shipTransDAO.getShipTrans(params,function(error,result){
        if (error) {
            logger.error(' queryShipTrans ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTrans ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateShipTrans(req,res,next){
    var params = req.params ;
    shipTransDAO.updateShipTrans(params,function(error,result){
        if (error) {
            logger.error(' updateShipTrans ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateShipTrans ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateShipTransStatus(req,res,next){
    var params = req.params ;
    shipTransDAO.updateShipTransStatus(params,function(error,result){
        if (error) {
            logger.error(' updateShipTransStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateShipTransStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createShipTrans : createShipTrans,
    queryShipTrans : queryShipTrans,
    updateShipTrans : updateShipTrans,
    updateShipTransStatus : updateShipTransStatus
}