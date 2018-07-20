/**
 * Created by zwl on 2018/7/20.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var shipTransOrderFeeRelDAO = require('../dao/ShipTransOrderFeeRelDAO.js');
var shipTransOrderDAO = require('../dao/ShipTransOrderDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ShipTransOrderFeeRel.js');

function createShipTransOrderFeeRel(req,res,next){
    var params = req.params ;
    var shipTransOrderFeeRelId = 0;
    Seq().seq(function(){
        var that = this;
        shipTransOrderFeeRelDAO.addShipTransOrderFeeRel(params,function(error,result){
            if (error) {
                logger.error(' createShipTransOrderFeeRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createShipTransOrderFeeRel ' + 'success');
                    shipTransOrderFeeRelId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create shipTransOrderFeeRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        shipTransOrderDAO.updateShipTransOrderFeePlus(params,function(error,result){
            if (error) {
                logger.error(' updateShipTransOrderFeePlus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateShipTransOrderFeePlus ' + 'success');
                }else{
                    logger.warn(' updateShipTransOrderFeePlus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createShipTransOrderFeeRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:shipTransOrderFeeRelId},null);
        return next();
    })
}

function queryShipTransOrderFeeRel(req,res,next){
    var params = req.params ;
    shipTransOrderFeeRelDAO.getShipTransOrderFeeRel(params,function(error,result){
        if (error) {
            logger.error(' queryShipTransOrderFeeRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryShipTransOrderFeeRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeShipTransOrderFeeRel(req,res,next){
    var params = req.params;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        shipTransOrderFeeRelDAO.getShipTransOrderFeeRel({shipTransOrderFeeRelId:params.shipTransOrderFeeRelId},function(error,rows){
            if (error) {
                logger.error(' getShipTransOrderFeeRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1){
                    parkObj.shipTransOrderId = rows[0].ship_trans_order_id;
                    parkObj.payMoney = rows[0].pay_money;
                    that();
                }else{
                    logger.warn(' getShipTransOrderFeeRel ' + 'failed');
                    resUtil.resetFailedRes(res," 付费项目不存在，或已被删除 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        shipTransOrderFeeRelDAO.deleteShipTransOrderFeeRel(params,function(error,result){
            if (error) {
                logger.error(' removeShipTransOrderFeeRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeShipTransOrderFeeRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeShipTransOrderFeeRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.shipTransOrderId =parkObj.shipTransOrderId;
        params.payMoney = parkObj.payMoney;
        shipTransOrderDAO.updateShipTransOrderFeeReduce(params,function(error,result){
            if (error) {
                logger.error(' updateShipTransOrderFeeReduce ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateShipTransOrderFeeReduce ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createShipTransOrderFeeRel : createShipTransOrderFeeRel,
    queryShipTransOrderFeeRel : queryShipTransOrderFeeRel,
    removeShipTransOrderFeeRel : removeShipTransOrderFeeRel
}
