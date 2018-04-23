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
var logger = serverLogger.createLogger('ShipTransOrder.js');

function createShipTransOrder(req,res,next){
    var params = req.params ;
    var shipTransId = 0;
    var shipTransOrderId = 0;
    Seq().seq(function(){
        var that = this;
        if(params.carIds.length==0){
            logger.warn(' createShipTransOrder ' + 'failed');
            resUtil.resetFailedRes(res," 未关联VIN码，保存失败 ");
            return next();
        }
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
        params.shipTransId = shipTransId;
        shipTransOrderDAO.addShipTransOrder(params,function(error,result){
            if (error) {
                logger.error(' createShipTransOrder ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createShipTransOrder ' + 'success');
                    shipTransOrderId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create shipTransOrder failed");
                    return next();
                }
            }
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
            shipTransCarRelDAO.addShipTransCarRel(subParams,function(err,result){
                if (err) {
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "商品车已经被关联，操作失败");
                        return next();
                    } else{
                        logger.error(' createShipTransOrder ' + err.message);
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
        logger.info(' createShipTransOrder ' + 'success');
        resUtil.resetCreateRes(res,{insertId:shipTransOrderId},null);
        return next();
    })
}

function queryShipTransOrder(req,res,next){
    var params = req.params ;
    shipTransOrderDAO.getShipTransOrder(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransOrder ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransOrder ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateShipTransOrderStatus(req,res,next){
    var params = req.params ;
    shipTransOrderDAO.updateShipTransOrderStatus(params,function(error,result){
        if (error) {
            logger.error(' updateShipTransOrderStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateShipTransOrderStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createShipTransOrder : createShipTransOrder,
    queryShipTransOrder : queryShipTransOrder,
    updateShipTransOrderStatus : updateShipTransOrderStatus
}